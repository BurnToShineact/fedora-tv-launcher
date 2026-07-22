const test = require('node:test');
const assert = require('node:assert/strict');

const {
  normalizeBluetoothError,
  parseBluetoothDeviceLines,
  parseVolume,
  parseWpctlSinks,
  splitNmcliLine
} = require('../src/lib/system-utils');

test('parseVolume reads percentage and mute state from wpctl', () => {
  assert.deepEqual(parseVolume('Volume: 0.73'), { volume: 73, muted: false });
  assert.deepEqual(parseVolume('Volume: 1.25 [MUTED]'), { volume: 125, muted: true });
  assert.deepEqual(parseVolume('unavailable'), { volume: 0, muted: false });
});

test('parseWpctlSinks reads only the sink section and default output', () => {
  const output = [
    'Audio',
    ' ├─ Sinks:',
    ' │  *   57. HDMI / DisplayPort 2 Output [vol: 0.70]',
    ' │      58. Built-in Audio Analog Stereo [vol: 0.40]',
    ' ├─ Sources:',
    ' │  *   61. Built-in Audio Microphone [vol: 1.00]'
  ].join('\n');
  assert.deepEqual(parseWpctlSinks(output), [
    { id: 57, name: 'HDMI / DisplayPort 2 Output', default: true },
    { id: 58, name: 'Built-in Audio Analog Stereo', default: false }
  ]);
});

test('parseBluetoothDeviceLines normalizes addresses and ignores noise', () => {
  const devices = parseBluetoothDeviceLines([
    'Device aa:bb:cc:dd:ee:ff Living Room Remote',
    'Controller 11:22:33:44:55:66 fedora [default]',
    'Device 01:23:45:67:89:AB Headphones'
  ].join('\n'));
  assert.deepEqual([...devices], [
    ['AA:BB:CC:DD:EE:FF', 'Living Room Remote'],
    ['01:23:45:67:89:AB', 'Headphones']
  ]);
});

test('normalizeBluetoothError returns stable user-facing messages', () => {
  assert.match(normalizeBluetoothError('org.bluez.Error.AuthenticationFailed'), /Сопряжение не удалось/);
  assert.match(normalizeBluetoothError('Operation already in progress'), /уже выполняется/);
  assert.match(normalizeBluetoothError('Page Timeout: not connected'), /не отвечает/);
  assert.equal(normalizeBluetoothError('custom failure'), 'custom failure');
});

test('splitNmcliLine handles escaped colons, backslashes and empty fields', () => {
  assert.deepEqual(splitNmcliLine('Living\\:Room:76:WPA2'), ['Living:Room', '76', 'WPA2']);
  assert.deepEqual(splitNmcliLine('Name::wifi:yes'), ['Name', '', 'wifi', 'yes']);
  assert.deepEqual(splitNmcliLine('Path\\\\Name:value'), ['Path\\Name', 'value']);
  assert.deepEqual(splitNmcliLine('unfinished\\'), ['unfinished\\']);
});
