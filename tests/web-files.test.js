const test = require('node:test');
const assert = require('node:assert/strict');

const {
  buildContentSearchUrl,
  cleanBrowserUserAgent,
  contentProviderForUrl,
  fileKind,
  isInsideFileBrowserRoots,
  isSecureWebUrl,
  normalizeWeatherCity,
  removableVolumesFromLsblk
} = require('../src/lib/system-utils');
const { KINOPOISK_IDS, MOVIES, randomTopMovie } = require('../src/data/kinopoisk-top250');

test('content discovery recognizes supported web apps and builds safe search URLs', () => {
  assert.equal(contentProviderForUrl('https://www.youtube.com/tv'), 'youtube');
  assert.equal(contentProviderForUrl('https://rutube.ru'), 'rutube');
  assert.equal(contentProviderForUrl('https://example.com'), null);
  assert.equal(
    buildContentSearchUrl('https://www.youtube.com/tv', 'фильм на вечер'),
    'https://www.youtube.com/results?search_query=%D1%84%D0%B8%D0%BB%D1%8C%D0%BC%20%D0%BD%D0%B0%20%D0%B2%D0%B5%D1%87%D0%B5%D1%80'
  );
  assert.equal(buildContentSearchUrl('https://example.com', 'video'), '');
});

test('offline Kinopoisk collection contains 250 unique movie suggestions', () => {
  assert.equal(MOVIES.length, 250);
  assert.equal(new Set(MOVIES).size, 250);
  assert.equal(KINOPOISK_IDS.length, MOVIES.length);
  assert.equal(new Set(KINOPOISK_IDS).size, MOVIES.length);
  assert.equal(KINOPOISK_IDS.every((id) => Number.isSafeInteger(id) && id > 0), true);
  assert.deepEqual(randomTopMovie(0), {
    catalogIndex: 0,
    title: '1+1',
    year: 2011,
    label: '1+1 (2011)',
    kinopoiskId: 535341,
    kinopoiskUrl: 'https://www.kinopoisk.ru/film/535341/',
    posterUrl: 'https://st.kp.yandex.net/images/film_iphone/iphone360_535341.jpg'
  });
  for (let index = 0; index < MOVIES.length; index += 1) {
    const movie = randomTopMovie(index);
    assert.equal(movie.kinopoiskId, KINOPOISK_IDS[index]);
    assert.equal(movie.kinopoiskUrl, `https://www.kinopoisk.ru/film/${movie.kinopoiskId}/`);
    assert.equal(movie.posterUrl, `https://st.kp.yandex.net/images/film_iphone/iphone360_${movie.kinopoiskId}.jpg`);
  }
  assert.equal(randomTopMovie(MOVIES.indexOf('Мотылек (1973)')).kinopoiskId, 4525);
  assert.equal(randomTopMovie(MOVIES.indexOf('Одержимость (2004)')).kinopoiskId, 23737);
});

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

test('lsblk parser finds mountable USB partitions and inherits disk transport', () => {
  const volumes = removableVolumesFromLsblk(JSON.stringify({
    blockdevices: [
      {
        name: '/dev/sdb',
        type: 'disk',
        rm: false,
        tran: 'usb',
        children: [
          {
            name: '/dev/sdb1',
            type: 'part',
            fstype: 'exfat',
            label: 'MOVIES',
            mountpoints: [null],
            rm: false,
            ro: false,
            size: 64000000000
          },
          {
            name: '/dev/sdb2',
            type: 'part',
            fstype: 'swap',
            mountpoints: ['[SWAP]'],
            rm: false
          }
        ]
      },
      {
        name: '/dev/nvme0n1p3',
        type: 'part',
        fstype: 'btrfs',
        mountpoints: ['/'],
        rm: false,
        tran: 'nvme'
      }
    ]
  }));
  assert.deepEqual(volumes, [{
    devicePath: '/dev/sdb1',
    label: 'MOVIES',
    fstype: 'exfat',
    mountPoints: [],
    mounted: false,
    readOnly: false,
    size: 64000000000
  }]);
});

test('lsblk parser preserves mounted removable volume details and rejects invalid data', () => {
  const volumes = removableVolumesFromLsblk(JSON.stringify({
    blockdevices: [{
      name: '/dev/mmcblk0p1',
      type: 'part',
      fstype: 'vfat',
      label: ' CAMERA\u0000 ',
      mountpoints: ['/run/media/tv/CAMERA'],
      rm: true,
      ro: '1',
      size: '32000000000'
    }]
  }));
  assert.equal(volumes[0].label, 'CAMERA');
  assert.equal(volumes[0].mounted, true);
  assert.equal(volumes[0].readOnly, true);
  assert.equal(volumes[0].size, 32000000000);
  assert.deepEqual(removableVolumesFromLsblk('not json'), []);
});
