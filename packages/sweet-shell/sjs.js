#!/usr/bin/env node

import('@ionian-wind/sweet/bin/sjs.js').catch((error) => {
  console.error(error);
  process.exit(1);
});
