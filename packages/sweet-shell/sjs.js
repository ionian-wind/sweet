#!/usr/bin/env node

import('@sweet-js/cli/bin/sjs.js').catch((error) => {
  console.error(error);
  process.exit(1);
});
