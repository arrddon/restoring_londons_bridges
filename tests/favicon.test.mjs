import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('the deployable favicon is tracked directly and both app entry points reference it', async () => {
  const [favicon, html, layout, prepareScript] = await Promise.all([
    readFile(new URL('../public/favicon.jpg', import.meta.url)),
    readFile(new URL('../index.html', import.meta.url), 'utf8'),
    readFile(new URL('../app/layout.tsx', import.meta.url), 'utf8'),
    readFile(new URL('../scripts/prepare-ar-assets.mjs', import.meta.url), 'utf8'),
  ]);
  assert.deepEqual([...favicon.subarray(0, 3)], [0xff, 0xd8, 0xff]);
  assert.match(html, /href="\/favicon\.jpg\?v=2"/);
  assert.match(layout, /\/favicon\.jpg\?v=2/);
  assert.doesNotMatch(prepareScript, /Assets\/favicon/);
});
