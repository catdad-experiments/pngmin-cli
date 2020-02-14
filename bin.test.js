/* eslint-env mocha */

const { spawn } = require('child_process');
const path = require('path');
const crypto = require('crypto');

const { expect } = require('chai');
const fs = require('fs-extra');
const eos = require('end-of-stream');
const root = require('rootrequire');
const isPng = require('is-png');

describe('pngmin-cli', () => {
  const exec = async (args, options = {}, input = Buffer.from('')) => {
    return await Promise.resolve().then(async () => {
      const proc = spawn(process.execPath, ['bin'].concat(args), Object.assign({}, options, {
        stdio: ['pipe', 'pipe', 'pipe'],
        cwd: root,
        windowsHide: true
      }));

      const stdout = [];
      const stderr = [];

      proc.stdout.on('data', chunk => stdout.push(chunk));
      proc.stderr.on('data', chunk => stderr.push(chunk));

      proc.stdin.end(input);

      const [code] = await Promise.all([
        new Promise(resolve => proc.on('exit', code => resolve(code))),
        new Promise(resolve => eos(proc.stdout, () => resolve())),
        new Promise(resolve => eos(proc.stderr, () => resolve())),
      ]);

      return {
        err: { code },
        stdout: Buffer.concat(stdout),
        stderr: Buffer.concat(stderr)
      };
    });
  };

  const hash = buffer => crypto.createHash('sha256').update(buffer).digest('hex');

  it('reads from stdin and writes to stdout', async () => {
    const input = await fs.readFile(path.resolve(root, 'temp', '0002.png'));
    const { stdout, stderr, err } = await exec([], {}, input);

    expect(isPng(stdout)).to.equal(true, 'output was not a PNG image');
    expect(hash(stdout)).to.equal('8da4f69b6808cdbb659f9a32b086c1c1b0e2473bcc62bb50904e0ad1d2706b8c');
    expect(stderr.toString()).to.equal('');
    expect(err).to.have.property('code', 0);
  });

  it('errors if given a non-png image', async () => {
    const input = await fs.readFile(path.resolve(root, 'temp', '0001.jpg'));
    const { stdout, stderr, err } = await exec([], {}, input);

    expect(stderr.toString()).to.include('Error: the provided input is not a PNG image');
    expect(stdout.toString()).to.equal('');
    expect(err).to.have.property('code', 1);
  });

  it('errors if given garbage content', async () => {
    const input = Buffer.from('I am but a wee string');
    const { stdout, stderr, err } = await exec([], {}, input);

    expect(stderr.toString()).to.include('Error: the provided input is not a PNG image');
    expect(stdout.toString()).to.equal('');
    expect(err).to.have.property('code', 1);
  });
});
