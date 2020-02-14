#!/usr/bin/env node

const pngquant = require('imagemin-pngquant');
const stdin = require('get-stdin');
const isPng = require('is-png');

(async () => {
  const input = await stdin.buffer();

  if (!isPng(input)) {
    throw new Error('the provided input is not a PNG image');
  }

  // use default compression options
  const output = await pngquant()(input);

  process.stdout.write(output);
})().catch(e => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exitCode = 1;
});
