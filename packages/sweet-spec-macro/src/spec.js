#lang 'sweet.js';
'lang sweet.js';

export syntax declare = ctx => {
  ctx.next(); // export
  let defaultOrClass = ctx.next().value; // class or default
  if (isKeyword(defaultOrClass, 'default')) {
    ctx.next(); // consume class
  }
  let name = ctx.next();
  let bodyOrExtends = ctx.next();
  let here = #`here`.get(0);

  function isDelimiter(x) {
    return x != null && x.type === 'RawDelimiter';
  }
  function isParens(x) {
    return isDelimiter(x) && x.kind === 'parens';
  }
  function isBrackets(x) {
    return isDelimiter(x) && x.kind === 'brackets';
  }
  function isBraces(x) {
    return isDelimiter(x) && x.kind === 'braces';
  }
  function isKeyword(x, value) {
    return !isDelimiter(x) && x.value.isKeyword(value);
  }
  function isIdentifier(x) {
    return !isDelimiter(x) && x.value.isIdentifier();
  }
  function isPunctuator(x, value) {
    return !isDelimiter(x) && x.value.isPunctuator(value);
  }
  function val(x) {
    return isDelimiter(x) ? x.kind : x.value.val();
  }

  function getBaseType(ctx) {
    let next = ctx.next().value;
    let arg = null;
    let typeName;
    if (isParens(next)) {
      arg = getAttrType(ctx.contextify(next));
    } else {
      typeName = val(next);
      arg = {
        typeName: val(next)
      };
    }

    let marker = ctx.mark();
    let typeArgStx = ctx.next();
    if (!typeArgStx.done && isBrackets(typeArgStx.value)) {
      return {
        typeName: 'List', arg
      };
    } else {
      ctx.reset(marker);
    }
    return {
      typeName: typeName,
      arg: arg
    };
  }

  function getAttrType(ctx) {
    let attrType = getBaseType(ctx);
    let next = ctx.next();
    if (!next.done && isPunctuator(next.value, '|')) {
      attrType = {
        typeName: 'Union',
        arg: [attrType]
      }
      do {
        let nextType = getBaseType(ctx);
        attrType.arg.push(nextType);
        next = ctx.next();
      } while (!next.done && isPunctuator(next.value, '|'));
    } else if (!next.done && !isPunctuator(next.value, ';')) {
      throw new Error('Unexpected token ' + val(next.value));
    }
    return attrType;
  }

  function findFields (delim, ctx) {
    let attributes = [];
    let innerCtx = ctx.contextify(delim);

    for (let stx of innerCtx) {
      if (isIdentifier(stx) || isKeyword(stx)) {
        let attrName = val(stx);
        let colonOrMaybe = innerCtx.next();
        let isMaybe = false;
        if (isPunctuator(colonOrMaybe.value, '?')) {
          colonOrMaybe = innerCtx.next();
          isMaybe = true;
        }
        if (!isPunctuator(colonOrMaybe.value, ':')) {
          throw new Error('Unexpected syntax: ' + val(colonOrMaybe.value));
        }

        let attrType = isMaybe ? { typeName: 'Maybe', arg: getAttrType(innerCtx) } : getAttrType(innerCtx);
        attributes.push({
          attrName,
          attrType: attrType,
          isOptional: isMaybe
        });
      }
    }
    return attributes;
  }

  function getHasAttrTemplate(attrs, attributes) {
    let hasAttrsTemplate = attributes
      .filter(function (attr) {
        return !attr.isOptional;
      })
      .map(function (attr) {
        let attrStx = here.fromString(attr.attrName);
        return #`
          if(!{}.hasOwnProperty.call(${attrs}, ${attrStx})) {
            throw new Error('Missing attribute: ' + ${attrStx});
          }`;
      });
    let temp = #``;
    for (let check of hasAttrsTemplate) {
      temp = temp.concat(check);
    }
    return temp;
  }

  /*
  type BaseType = {
    typeName: 'any';
  } | {
    typeName: 'List';
    arg: AttrType;
  } | {
    typeName: string;
  }
  type CompoundType = {
    typeName: 'Union';
    arg: BaseType[]
  }

  type AttrType = BaseType | CompoundType

  */

  function attrAction(reducerStx, attrStx, attr) {
    let attrNameStx = here.fromIdentifier(attr.attrName);
    let attrTypeStx = name.value.fromIdentifier(attr.attrType.typeName);
    let action;
    switch (attr.attrType.typeName) {
      case 'any':
        action = #`${attrStx}`;
        break;
      case 'List':
        let mappedAttr = {
          attrName: attr.attrName,
          attrType: attr.attrType.arg,
        };
        action = #`${attrStx}.map(function () { return ${attrAction(reducerStx, #`arguments[0]`, mappedAttr)}; })`
        break;
      case 'Union':
        action = attr.attrType.arg.reduce((acc, attrType) => {
          if (attrType.typeName === 'null') {
            return acc.concat(#` (${attrStx} == null) ? null :`);
          }
          return acc.concat(#`
            (${attrStx} instanceof ${name.value.fromIdentifier(attrType.typeName)}) ?
            (${attrStx}.reduce(${reducerStx})) :`);
        }, #``).concat(#`function () { throw new Error('Unknown object: ' + JSON.stringify(${attrStx}))}.call(this)`);
        break;
      case 'Maybe':
        let maybeAttr = {
          attrName: attr.attrName,
          attrType: attr.attrType.arg
        };
        action = #`${attrStx} == null ? null : ${attrAction(reducerStx, attrStx, maybeAttr)}`;
        break;
      default:
        action = #`
          (${attrStx} instanceof ${attrTypeStx}) ?
          (${attrStx}.reduce(${reducerStx})) :
          function () { throw new Error('Unknown object: ' + JSON.stringify(${attrStx})) }.call(this)`;
    }
    return action;
  }

  function assignState(stateStx, reducerStx, attributes) {
    let subReduce = attributes.map(function (attr) {
      let attrNameStx = here.fromIdentifier(attr.attrName);
      let attrStx = #`this.${attrNameStx}`;
      return #`${stateStx}.${attrNameStx} = ${attrAction(reducerStx, attrStx, attr)};`
    });
    let result = #``;
    for (let red of subReduce) {
      result = result.concat(red);
    }
    return result;
  }

  function getCloneAttrs(attributes) {
    return attributes.reduce((acc, attr) => {
      let attrStx = here.fromIdentifier(attr.attrName);
      return acc.concat(#`${attrStx} : this.${attrStx},`);
    }, #``);
  }

  let reduceNameStx = here.fromIdentifier('reduce' + val(name.value));
  let nameStr = here.fromString(val(name.value));
  if ((!bodyOrExtends.done) && isBraces(bodyOrExtends.value)) {
    let attributes = findFields(bodyOrExtends.value, ctx);
    return #`
      class ${name.value} {
        constructor(attrs, type) {
          ${getHasAttrTemplate(#`attrs`, attributes)}
          Object.assign(this, attrs);
          this.type = type || ${nameStr};
          this.loc = null;
          Object.freeze(this);
        }
        _reduceState(reducer, state = {}) {
          ${assignState(#`state`, #`reducer`, attributes)}
          return state;
        }
        _cloneAttrs() {
          return {
            ${getCloneAttrs(attributes)}
          };
        }
        reduce(reducer) {
          let state = this._reduceState(reducer);
          return reducer.${reduceNameStx}(this, state);
        }
        extend(attrs) {
          return new ${name.value}(Object.assign(this._cloneAttrs(), attrs));
        }
        // TODO: hack, do this right
        from(type, value) {
          if (this.value && typeof this.value.from === 'function') {
            return this.value.from(type, value);
          }
          throw new Error('Not implemented yet');
        }
        fromNull() {
          return this.from("null", null);
        }

        fromNumber(value) {
          return this.from('number', value);
        }

        fromString(value) {
          return this.from("string", value);
        }

        fromPunctuator(value) {
          return this.from("punctuator", value);
        }

        fromKeyword(value) {
          return this.from("keyword", value);
        }

        fromIdentifier(value) {
          return this.from("identifier", value);
        }

        fromRegularExpression(value) {
          return this.from("regularExpression", value);
        }

        fromBraces(inner) {
          return this.from("braces", inner);
        }

        fromBrackets(inner) {
          return this.from("brackets", inner);
        }

        fromParens(inner) {
          return this.from("parens", inner);
        }

      }

      ${name.value}.CloneReducer = class {
        ${reduceNameStx}(term, state) {
          return new ${name.value}(state);
        }
      };
      export default ${name.value};
    `;
  } else {
    let base = ctx.next();
    let body = ctx.next();
    let attributes = findFields(body.value, ctx);
    return #`
      class ${name.value} extends ${base.value} {
        constructor(attrs, type) {
          super(attrs, type || ${nameStr});
          ${getHasAttrTemplate(#`attrs`, attributes)}
        }
        _reduceState(reducer, state = {}) {
          ${assignState(#`state`, #`reducer`, attributes)};
          return super._reduceState(reducer, state);
        }
        _cloneAttrs() {
          return Object.assign({
            ${getCloneAttrs(attributes)}
          }, super._cloneAttrs());
        }
        reduce(reducer) {
          let state = this._reduceState(reducer);
          return reducer.${reduceNameStx}(this, state);
        }
        extend(attrs) {
          return new ${name.value}(Object.assign(this._cloneAttrs(), attrs));
        }
      }
      ${base.value}.CloneReducer.prototype.${reduceNameStx} = function (term, state) {
        return new ${name.value}(state);
      };
      export { ${name.value} };
    `;
  }
};
