import presetEnv from '@babel/preset-env';
import presetFlow from '@babel/preset-flow';

export default function sweetBabelPreset(api, options = {}) {
  api.assertVersion(8);

  const {
    flow = true,
    modules = false,
    targets = { node: 'current' },
  } = options;

  const presets = [[presetEnv, { targets, modules }]];

  if (flow) {
    presets.push(presetFlow);
  }

  return {
    presets,
    sourceMaps: 'inline',
  };
}
