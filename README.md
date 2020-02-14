# pngmin-cli

> A piping CLI for optimizing PNG images

[![travis][travis.svg]][travis.link]
[![npm-downloads][npm-downloads.svg]][npm.link]
[![npm-version][npm-version.svg]][npm.link]

[travis.svg]: https://travis-ci.com/catdad-experiments/pngmin-cli.svg?branch=master
[travis.link]: https://travis-ci.com/catdad-experiments/pngmin-cli
[npm-downloads.svg]: https://img.shields.io/npm/dm/pngmin-cli.svg
[npm.link]: https://www.npmjs.com/package/pngmin-cli
[npm-version.svg]: https://img.shields.io/npm/v/pngmin-cli.svg

You put a PNG in and get a smaller PNG out. It's that simple.

```bash
npx pngmin-cli < original.png > optimized.png
```

This is a wrapper around the wonderful [`imagemin`](https://github.com/imagemin/imagemin) using `pngquant`. If you are already using those tools, this CLI will not give you better output. If you like dealing with images but hate dealing with files, this CLI is for you.
