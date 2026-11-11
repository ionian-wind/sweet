'use strict';

module.exports = function sweetBabelPreset(api, options = {}) {
  api.assertVersion(7);

  const {
    flow = true,
    modules = 'commonjs',
    targets = { node: 'current' },
  } = options;

  const presets = [[require.resolve('@babel/preset-env'), { targets, modules }]];

  if (flow) {
    presets.push(require.resolve('@babel/preset-flow'));
  }

  return {
    presets,
    sourceMaps: 'inline',
  };
};
