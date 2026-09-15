import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bridges } from '../lib/bridge-config.ts';
import { completionKey, readCompletion, writeCompletion } from '../lib/completion-storage.ts';
import { mapLocations, mapStartingPoints } from '../lib/map-locations.ts';

test('all ten destinations resolve to their bridge and spot', () => {
  assert.equal(bridges.length, 2);
  const urls = new Set();
  for (const bridge of bridges) {
    assert.equal(bridge.spots.length, 5);
    for (const spot of bridge.spots) {
      assert.equal(spot.destination, `/${bridge.id}/${spot.pinId}`);
      assert.equal(spot.bridgeId, bridge.id);
      assert.ok(spot.position.x > 0 && spot.position.x < 1);
      assert.ok(spot.position.y > 0 && spot.position.y < 1);
      urls.add(spot.destination);
    }
  }
  assert.equal(urls.size, 10);
});

test('each bridge is numbered 01 south to 05 north', () => {
  for (const bridge of bridges) {
    const southToNorth = [...bridge.spots].sort((a, b) => mapLocations[a.pinId].latitude - mapLocations[b.pinId].latitude);
    const prefix = bridge.id === 'AlbertBridge' ? 'A' : 'H';
    assert.deepEqual(southToNorth.map(spot => spot.pinId), [1, 2, 3, 4, 5].map(number => `${prefix}0${number}`));
    assert.deepEqual(southToNorth.map(spot => spot.title.slice(0, 2)), ['01', '02', '03', '04', '05']);
    assert.deepEqual(southToNorth.map(spot => spot.destination), southToNorth.map(spot => `/${bridge.id}/${spot.pinId}`));
  }
});

test('Albert Bridge uses surveyed pins and starts at southern A01', () => {
  assert.deepEqual(mapLocations.A01, { latitude: 51.481308, longitude: -0.166309 });
  assert.deepEqual(mapLocations.A02, { latitude: 51.481832, longitude: -0.166397 });
  assert.deepEqual(mapLocations.A03, { latitude: 51.482253, longitude: -0.166610 });
  assert.deepEqual(mapLocations.A04, { latitude: 51.482714, longitude: -0.166838 });
  assert.deepEqual(mapLocations.A05, { latitude: 51.483198, longitude: -0.167068 });
  assert.equal(mapStartingPoints.AlbertBridge, mapLocations.A01);
  const a01 = bridges.find(bridge => bridge.id === 'AlbertBridge').spots.find(spot => spot.pinId === 'A01');
  assert.equal(a01.assetType, '3d');
  assert.equal(a01.destination, '/AlbertBridge/A01');
  assert.equal(a01.modelPath, 'https://res.cloudinary.com/douz9wtb2/image/upload/v1789456312/A01_model_xokmyr.glb');
});

test('Hammersmith Bridge uses the supplied titles and surveyed coordinates', () => {
  const hammersmith = bridges.find(bridge => bridge.id === 'HammersmithBridge');
  assert.deepEqual(hammersmith.spots.map(spot => [spot.pinId, spot.title]), [
    ['H01', '01. Silvertown Tunnel'],
    ['H02', '02. Boat Race'],
    ['H03', '03. Bazalgette'],
    ['H04', '04. Weather Data'],
    ['H05', '05. IRA Bombing'],
  ]);
  assert.deepEqual(mapLocations.H01, { latitude: 51.487487, longitude: -0.231072 });
  assert.deepEqual(mapLocations.H02, { latitude: 51.487866, longitude: -0.230675 });
  assert.deepEqual(mapLocations.H03, { latitude: 51.488470, longitude: -0.230068 });
  assert.deepEqual(mapLocations.H04, { latitude: 51.488915, longitude: -0.229597 });
  assert.deepEqual(mapLocations.H05, { latitude: 51.489214, longitude: -0.229270 });
  const h04 = hammersmith.spots.find(spot => spot.pinId === 'H04');
  assert.equal(h04.assetType, 'image');
  assert.equal(h04.audioPath, null);
  assert.equal(h04.contentDurationSeconds, 60);
});

test('all point assets match the approved asset manifest', () => {
  const expected = {
    A01: ['01. Stop Marching Sign', '3d', 'A01_model_xokmyr.glb', 'A01_audio_juuptd.mp3', null],
    A02: ['02. Timber and Ashphalt', '3d', 'A02_model_qra1kg.glb', 'A02_audio_q0sipu.mp3', null],
    A03: ['03. Bazalgette', 'video', null, null, 'A03_video_uhoagu.mp4'],
    A04: ['04. Lights on the Bridge', 'image', 'A04_image_hwgvpn.jpg', 'A04_audio_ljpesh.mp3', null],
    A05: ['05. The Damaged Rocker', '3d', 'A05_model_okrfgz.glb', 'A05_audio_mocwxx.mp3', null],
    H01: ['01. Silvertown Tunnel', '3d', 'H01_model_dh03cv.glb', 'H01_audio_fopekz.mp3', null],
    H02: ['02. Boat Race', 'video', null, null, 'H02_video_yszts1.mp4'],
    H03: ['03. Bazalgette', '3d', 'H03_model_raopgc.glb', 'H03_audio_khl7dt.mp3', null],
    H04: ['04. Weather Data', 'image', 'H04_image_xfq0jx.jpg', null, null],
    H05: ['05. IRA Bombing', 'video', null, null, 'H05_video_t7eleh.mp4'],
  };
  for (const spot of bridges.flatMap(bridge => bridge.spots)) {
    const visual = spot.modelPath ?? spot.imagePath;
    assert.deepEqual([
      spot.title,
      spot.assetType,
      visual?.split('/').at(-1) ?? null,
      spot.audioPath?.split('/').at(-1) ?? null,
      spot.videoPath?.split('/').at(-1) ?? null,
    ], expected[spot.pinId]);
    assert.deepEqual(spot.sourceAssets, {
      model: spot.modelPath, audio: spot.audioPath, video: spot.videoPath, image: spot.imagePath,
    });
  }
});

test('completion persists and never crosses bridges or spots', () => {
  const values = new Map();
  const storage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
  assert.equal(readCompletion(storage, 'bridge-a', 'spot-01'), false);
  assert.equal(writeCompletion(storage, 'bridge-a', 'spot-01'), true);
  assert.equal(readCompletion(storage, 'bridge-a', 'spot-01'), true);
  assert.equal(readCompletion(storage, 'bridge-b', 'spot-01'), false);
  assert.equal(readCompletion(storage, 'bridge-a', 'spot-02'), false);
  assert.notEqual(completionKey('bridge-a', 'spot-01'), completionKey('bridge-b', 'spot-01'));
});

test('blocked or corrupt storage does not crash the experience', () => {
  const blocked = { getItem() { throw Error('blocked'); }, setItem() { throw Error('quota'); } };
  assert.equal(readCompletion(blocked, 'a', 's'), false);
  assert.equal(writeCompletion(blocked, 'a', 's'), false);
  assert.equal(readCompletion({ getItem: () => '{corrupted}' }, 'a', 's'), false);
});
