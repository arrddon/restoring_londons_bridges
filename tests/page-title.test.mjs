import test from 'node:test';
import assert from 'node:assert/strict';
import { bridges } from '../lib/bridge-config.ts';
import { pageTitle } from '../lib/page-title.ts';
import { resolveFieldGuideSpot } from '../lib/field-guide-route.ts';

test('Hammersmith routes receive specific browser titles', () => {
  assert.equal(pageTitle(['HammersmithBridge'], bridges), 'Hammersmith Bridge');
  assert.equal(pageTitle(['HammersmithBridge', 'Guide'], bridges), 'Hammersmith Bridge — Audience Guide');
  assert.equal(pageTitle(['HammersmithBridge', 'QRCodes'], bridges), 'Hammersmith Bridge — QR Codes');
  assert.equal(pageTitle(['HammersmithBridge', 'Guide-H01'], bridges), '01. Silvertown Tunnel — Print QR Guide');
  assert.equal(pageTitle(['HammersmithBridge', 'Guide-A02'], bridges), 'Hammersmith Bridge');
  assert.equal(pageTitle(['HammersmithBridge', 'H01'], bridges), '01. Silvertown Tunnel — Hammersmith Bridge');
  assert.equal(pageTitle(['HammersmithBridge', 'H01', 'ar'], bridges), '01. Silvertown Tunnel AR — Hammersmith Bridge');
  assert.equal(pageTitle(['HammersmithBridge', 'H02', 'ar'], bridges), '02. Boat Race Content — Hammersmith Bridge');
});

test('print-guide routes require the selected bridge prefix', () => {
  const hammersmith = bridges.find(bridge => bridge.id === 'HammersmithBridge');
  assert.equal(resolveFieldGuideSpot('Guide-A02', hammersmith.spots), undefined);
  assert.equal(resolveFieldGuideSpot('Guide-H02', hammersmith.spots)?.pinId, 'H02');
});
