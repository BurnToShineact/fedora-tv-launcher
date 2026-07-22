#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const packageInfo = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8'));
const fileName = `fedora-tv-os-${packageInfo.version}-x86_64.rpm`;
const rpmPath = path.join(projectRoot, 'dist', fileName);
const metadataPath = path.join(projectRoot, 'dist', 'latest-linux.yml');

if (!fs.existsSync(rpmPath)) {
  throw new Error(`RPM not found: ${rpmPath}`);
}

const contents = fs.readFileSync(rpmPath);
const sha512 = crypto.createHash('sha512').update(contents).digest('base64');
const metadata = [
  `version: ${packageInfo.version}`,
  'files:',
  `  - url: ${fileName}`,
  `    sha512: ${sha512}`,
  `    size: ${contents.length}`,
  `path: ${fileName}`,
  `sha512: ${sha512}`,
  `releaseDate: '${new Date().toISOString()}'`,
  ''
].join('\n');

fs.writeFileSync(metadataPath, metadata, 'utf8');
console.log(`Updated ${path.relative(projectRoot, metadataPath)} for signed ${fileName}`);
