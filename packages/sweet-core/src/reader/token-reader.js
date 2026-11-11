// @flow

import { CharStream, isEOS, Reader, setCurrentReadtable } from 'readtable';
import defaultReadtable from './default-readtable';
import { List } from 'immutable';
import { EmptyToken } from '../tokens';

import type { StartLocation, Slice } from '../tokens';

setCurrentReadtable(defaultReadtable);

export type LocationInfo = {
  line: number,
  column: number,
};

type Context = {
  bindings: any,
  scopesets: any,
};

export function getSlice(
  // $FlowFixMe[value-as-type]
  stream: CharStream,
  startLocation: StartLocation,
): Slice {
  return {
    text: stream.getSlice(startLocation.position),
    start: startLocation.position,
    startLocation,
    end: stream.sourceInfo.position,
  };
}

// $FlowFixMe[underconstrained-implicit-instantiation]
const streams = new WeakMap();

class ReadError extends Error {
  index: number;
  line: number;
  column: number;
  message: string;
  constructor({
    index,
    line,
    column,
    message,
  }: {
    index: number,
    line: number,
    column: number,
    message: string,
  }) {
    super(message);
    this.index = index;
    this.line = line;
    this.column = column;
    this.message = `[${line}:${column}] ${message}`;
  }
}

class TokenReader extends Reader {
  locationInfo: LocationInfo;
  context: ?Context;
  // $FlowFixMe[value-as-type]
  constructor(stream: CharStream, context?: Context) {
    super();
    this.context = context;
    streams.set(this, stream);
    this.locationInfo = {
      line: 1,
      column: 1,
    };
  }

  createError(msg: string): ReadError {
    let message = msg.replace(/\{(\d+)\}/g, (_, n) =>
      JSON.stringify(arguments[+n + 1]),
    );
    return new ReadError({
      message,
      // $FlowFixMe[incompatible-type]
      index: streams.get(this)?.sourceInfo?.position,
      line: this.locationInfo.line,
      column: this.locationInfo.column,
    });
  }

  // $FlowFixMe[missing-local-annot]
  createILLEGAL(char) {
    return !isEOS(char)
      ? // $FlowFixMe[extra-arg]
        this.createError('Unexpected {0}', char)
      : this.createError('Unexpected end of input');
  }

  // $FlowFixMe[missing-local-annot]
  // $FlowFixMe[value-as-type]
  readToken(stream: CharStream, ...rest: Array<any>) {
    // $FlowFixMe[prop-missing]
    // $FlowFixMe[unsafe-object-assign]
    const startLocation = Object.assign(
      {},
      this.locationInfo,
      stream.sourceInfo,
    );
    const result = super.read(stream, ...rest);

    if (
      startLocation.column === this.locationInfo.column &&
      startLocation.line === this.locationInfo.line
    ) {
      this.locationInfo.column +=
        stream.sourceInfo.position - startLocation.position;
    }

    if (result === EmptyToken) return result;

    if (!List.isList(result)) result.slice = getSlice(stream, startLocation);

    return result;
  }

  readUntil(
    close: ?Function | ?string,
    // $FlowFixMe[value-as-type]
    stream: CharStream,
    prefix: List<any>,
    exprAllowed: boolean,
  ): List<any> {
    let result,
      results = prefix,
      done = false;
    do {
      if (isEOS(stream.peek())) break;
      done = typeof close === 'function' ? close() : stream.peek() === close;
      result = this.readToken(stream, results, exprAllowed);

      if (result !== EmptyToken) {
        results = results.push(result);
      }
    } while (!done);
    return results;
  }

  incrementLine(): void {
    this.locationInfo.line += 1;
    this.locationInfo.column = 1;
  }
}

export default function read(
  // $FlowFixMe[value-as-type]
  source: string | CharStream,
  context?: Context,
): List<any> {
  const stream = typeof source === 'string' ? new CharStream(source) : source;
  if (isEOS(stream.peek())) return List();
  return new TokenReader(stream, context).readUntil(
    null,
    stream,
    List(),
    false,
  );
}
