const test = require('node:test');
const assert = require('node:assert/strict');

const {
  POWER_DEFAULTS,
  normalizeDisplayMode,
  normalizeDisplayOutput,
  validateDisplayCandidate,
  validatePowerSettings
} = require('../src/lib/system-utils');

test('normalizeDisplayMode creates a stable mode identifier', () => {
  assert.deepEqual(normalizeDisplayMode({ width: 1920, height: 1080, refresh: 59.94, current: 1 }), {
    width: 1920,
    height: 1080,
    refresh: 59.94,
    preferred: false,
    current: true,
    id: '1920x1080@59.940'
  });
});

test('normalizeDisplayOutput clamps scale and normalizes wlr-randr fields', () => {
  const output = normalizeDisplayOutput({
    name: 'HDMI-A-1',
    make: 'Example',
    model: 'TV',
    position: { x: 120, y: -40 },
    scale: 8,
    adaptive_sync: 'enabled',
    modes: [
      { width: 3840, height: 2160, refresh: 60, preferred: true },
      { width: 0, height: 0, refresh: 0 }
    ]
  });
  assert.equal(output.description, 'Example TV');
  assert.equal(output.scale, 3);
  assert.equal(output.x, 120);
  assert.equal(output.y, -40);
  assert.equal(output.adaptiveSync, true);
  assert.equal(output.modes.length, 1);
});

test('validateDisplayCandidate protects the only active output', () => {
  const output = normalizeDisplayOutput({
    name: 'HDMI-A-1',
    enabled: true,
    scale: 1,
    modes: [{ width: 1920, height: 1080, refresh: 60, current: true }]
  });
  assert.deepEqual(
    validateDisplayCandidate({ output: 'HDMI-A-1', enabled: false }, { outputs: [output] }),
    { error: 'Нельзя отключить единственный активный дисплей.' }
  );
});

test('validateDisplayCandidate selects a supported mode and clamps geometry', () => {
  const output = normalizeDisplayOutput({
    name: 'HDMI-A-1',
    enabled: true,
    scale: 1,
    adaptive_sync: 'enabled',
    modes: [{ width: 1920, height: 1080, refresh: 60, current: true }]
  });
  const result = validateDisplayCandidate({
    output: 'HDMI-A-1',
    mode: 'missing-mode',
    scale: 0.1,
    transform: 'invalid',
    x: 999999,
    y: -999999,
    adaptiveSync: false
  }, { outputs: [output] });
  assert.equal(result.mode.id, '1920x1080@60.000');
  assert.equal(result.scale, 0.5);
  assert.equal(result.transform, 'normal');
  assert.equal(result.x, 32768);
  assert.equal(result.y, -32768);
  assert.equal(result.adaptiveSync, false);
});

test('validatePowerSettings accepts known values and falls back safely', () => {
  assert.deepEqual(validatePowerSettings({
    idleTimeout: '30',
    powerButtonAction: 'suspend',
    lidAction: 'ignore',
    lidExternalAction: 'poweroff',
    lidDockedAction: 'suspend'
  }), {
    idleTimeout: 30,
    powerButtonAction: 'suspend',
    lidAction: 'ignore',
    lidExternalAction: 'poweroff',
    lidDockedAction: 'suspend'
  });
  assert.deepEqual(validatePowerSettings({ idleTimeout: 999, powerButtonAction: 'format-disk' }), POWER_DEFAULTS);
});
