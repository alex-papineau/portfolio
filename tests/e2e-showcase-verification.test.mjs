import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('Production Build & Asset Verification for Amazon SMT Music Companion', () => {
  const htmlPath = 'dist/portfolio/amazon-smt-music-companion/index.html';
  assert.ok(fs.existsSync(htmlPath), 'Page HTML must exist in dist');

  const html = fs.readFileSync(htmlPath, 'utf-8');
  assert.ok(html.includes('amazon.ca'), 'HTML must include amazon.ca tab');
  assert.ok(html.includes('tab-wikipedia'), 'HTML must include wikipedia tab');
  assert.ok(html.includes('tab-google'), 'HTML must include google tab');
  assert.ok(html.includes('smt-popup-iframe'), 'HTML must include popup iframe');
  assert.ok(html.includes('SMT.COMPANION'), 'HTML must include window title');

  const assetFiles = [
    'manifest.json',
    'config.js',
    'background.js',
    'content.js',
    'content.css',
    'popup/popup.html',
    'popup/popup.css',
    'popup/popup.js',
    'assets/press-turn.png',
    'font/Megaten20XX.woff',
    'runtime/chrome-runtime-shim.js',
  ];

  for (const file of assetFiles) {
    const p = `dist/showcases/amazon-smt-companion/${file}`;
    assert.ok(fs.existsSync(p), `Asset must be present in dist: ${file}`);
    assert.ok(fs.statSync(p).size > 0, `Asset must not be empty: ${file}`);
  }
});
