const test = require('node:test');
const assert = require('node:assert/strict');

const {
  cleanBrowserUserAgent,
  fileKind,
  isInsideFileBrowserRoots,
  isSecureWebUrl,
  normalizeWeatherCity
} = require('../src/lib/system-utils');

test('cleanBrowserUserAgent hides Electron product tokens', () => {
  assert.equal(
    cleanBrowserUserAgent('Mozilla/5.0 Chrome/150.0 Electron/43.0.0 fedora-tv-os/3.1.0 Safari/537.36'),
    'Mozilla/5.0 Chrome/150.0 Safari/537.36'
  );
  assert.equal(cleanBrowserUserAgent(null), '');
});

test('normalizeWeatherCity trims safe city labels and rejects invalid lengths', () => {
  assert.equal(normalizeWeatherCity('  Нижний   Новгород  '), 'Нижний Новгород');
  assert.equal(normalizeWeatherCity('New\u0000 York'), 'New York');
  assert.equal(normalizeWeatherCity('A'), '');
  assert.equal(normalizeWeatherCity('x'.repeat(65)), '');
});

test('isSecureWebUrl accepts only valid HTTPS URLs', () => {
  assert.equal(isSecureWebUrl('https://example.com/watch?v=1'), true);
  assert.equal(isSecureWebUrl('HTTPS://example.com'), true);
  assert.equal(isSecureWebUrl('http://example.com'), false);
  assert.equal(isSecureWebUrl('file:///etc/passwd'), false);
  assert.equal(isSecureWebUrl('not a url'), false);
});

test('file browser boundary accepts roots and descendants but not prefix siblings', () => {
  const roots = [{ path: '/home/tv' }, { path: '/run/media/tv' }];
  assert.equal(isInsideFileBrowserRoots('/home/tv', roots), true);
  assert.equal(isInsideFileBrowserRoots('/home/tv/Videos/movie.mkv', roots), true);
  assert.equal(isInsideFileBrowserRoots('/run/media/tv/USB/video.mp4', roots), true);
  assert.equal(isInsideFileBrowserRoots('/home/tv-other/private.txt', roots), false);
  assert.equal(isInsideFileBrowserRoots('/etc/passwd', roots), false);
  assert.equal(isInsideFileBrowserRoots('relative/path', roots), false);
  assert.equal(isInsideFileBrowserRoots('/home/tv', [{ path: 'relative/root' }]), false);
});

test('fileKind classifies supported media and document extensions', () => {
  assert.equal(fileKind('/tmp/MOVIE.MKV', false), 'video');
  assert.equal(fileKind('/tmp/song.flac', false), 'audio');
  assert.equal(fileKind('/tmp/photo.webp', false), 'image');
  assert.equal(fileKind('/tmp/manual.pdf', false), 'document');
  assert.equal(fileKind('/tmp/backup.tar', false), 'archive');
  assert.equal(fileKind('/tmp/unknown.bin', false), 'file');
  assert.equal(fileKind('/tmp/folder.mp4', true), 'folder');
});
