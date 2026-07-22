const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const projectRoot = path.join(__dirname, '..');

test('TV session registers with GDM before its delayed fallback can switch VTs', () => {
  const desktop = fs.readFileSync(path.join(projectRoot, 'session', 'fedora-tv-os.desktop'), 'utf8');
  const startup = fs.readFileSync(path.join(projectRoot, 'session', 'fedora-tv-os-startup'), 'utf8');
  assert.match(desktop, /^X-GDM-SessionRegisters=true$/m);
  assert.match(startup, /org\.gnome\.DisplayManager\.Manager\.RegisterSession/);
});

test('clean Electron exits restart the shell instead of ending the login session', () => {
  const startup = fs.readFileSync(path.join(projectRoot, 'session', 'fedora-tv-os-startup'), 'utf8');
  assert.match(startup, /if \[ "\$STATUS" -eq 0 \]; then[\s\S]*restart=clean[\s\S]*continue/);
  assert.doesNotMatch(startup, /if \/usr\/bin\/fedora-tv-os[^\n]*; then\s+exit 0/);
});
