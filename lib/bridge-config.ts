export type Spot = {
  id: string; bridgeId: string; title: string; pinId: string;
  assetType: '3d' | 'video' | 'image';
  sourceAssets: { model: string | null; audio: string | null; video: string | null; image: string | null };
  contentDurationSeconds: number | null; position: { x: number; y: number };
  destination: string; modelPath: string | null; audioPath: string | null; videoPath: string | null; imagePath: string | null;
  modelSizeMeters: number; videoWidthMeters: number; scale: number; rotation: [number, number, number];
};
export type Bridge = { id: string; title: string; mapPath: string; mapWidth: number; mapHeight: number; mapFocusY: number; landscapeAngle: number; spots: Spot[] };
const cloud = 'https://res.cloudinary.com/douz9wtb2';
const model = (v: string, n: string) => `${cloud}/image/upload/${v}/${n}.glb`;
const image = (v: string, n: string) => `${cloud}/image/upload/${v}/${n}.jpg`;
const audio = (v: string, n: string) => `${cloud}/video/upload/${v}/${n}.mp3`;
const video = (v: string, n: string) => `${cloud}/video/upload/${v}/${n}.mp4`;
type PointData = { title: string; assetType: Spot['assetType']; model?: string; image?: string; video?: string; audio?: string };
const data: Record<string, PointData[]> = {
  AlbertBridge: [
    { title: 'Stop Marching Sign', assetType: '3d', model: model('v1789592434', 'A01_model_fkn5kn'), audio: audio('v1789592438', 'A01_audio_lydbp1') },
    { title: 'Timber and Ashphalt', assetType: '3d', model: model('v1789592447', 'A02_model_naxncr'), audio: audio('v1789592440', 'A02_audio_f4tv3w') },
    { title: 'Bazalgette', assetType: 'image', image: image('v1789592432', 'A03_image_aoyiei'), audio: audio('v1789592686', 'A03_audio_mpfnsc') },
    { title: 'Lights on the Bridge', assetType: 'image', image: image('v1789592433', 'A04_image_yvykoy'), audio: audio('v1789592437', 'A04_audio_k2ouns') },
    { title: 'The Damaged Rocker', assetType: '3d', model: model('v1789592445', 'A05_model_gvm0ih'), audio: audio('v1789592434', 'A05_audio_htf0mi') },
  ],
  HammersmithBridge: [
    { title: 'Silvertown Tunnel', assetType: '3d', model: model('v1789592414', 'H01_model_lbglsm'), audio: audio('v1789592397', 'H01_audio_cg2obk') },
    { title: 'Boat Race', assetType: 'video', video: video('v1789592420', 'H02_video_zmv1et') },
    { title: 'Dalek', assetType: '3d', model: model('v1789592396', 'H03_model_bslgul'), audio: audio('v1789592396', 'H03_audio_kyj5ae') },
    { title: 'Coat of Arms', assetType: '3d', model: model('v1789592408', 'H04_model_axevpt'), audio: audio('v1789592398', 'H04_audio_vfqkcv') },
    { title: 'IRA Bombing', assetType: 'video', video: video('v1789592423', 'H05_video_z44nu4') },
  ],
};
const positions = [{ x: .275, y: .235 }, { x: .40, y: .31 }, { x: .52, y: .38 }, { x: .65, y: .455 }, { x: .775, y: .53 }];
const albertPositions = [{ x: .405, y: .25 }, { x: .465, y: .375 }, { x: .525, y: .50 }, { x: .585, y: .625 }, { x: .645, y: .75 }];
export const bridges: Bridge[] = [
  { id: 'AlbertBridge', title: 'Albert Bridge', mapPath: '/Assets/Maps/map_AB_v3.png', mapWidth: 941, mapHeight: 1672, mapFocusY: .5, landscapeAngle: 0 },
  { id: 'HammersmithBridge', title: 'Hammersmith Bridge', mapPath: '/Assets/Maps/map_HB_v3.png', mapWidth: 941, mapHeight: 1672, mapFocusY: .5, landscapeAngle: 0 },
].map(bridge => ({ ...bridge, spots: data[bridge.id].map((point, i) => {
  const pinId = `${bridge.id === 'AlbertBridge' ? 'A' : 'H'}${String(i + 1).padStart(2, '0')}`;
  return {
    id: `spot-${String(i + 1).padStart(2, '0')}`, bridgeId: bridge.id, pinId,
    title: `${String(i + 1).padStart(2, '0')}. ${point.title}`, assetType: point.assetType,
    sourceAssets: { model: point.model ?? null, audio: point.audio ?? null, video: point.video ?? null, image: point.image ?? null },
    contentDurationSeconds: null, position: (bridge.id === 'AlbertBridge' ? albertPositions : positions)[i],
    destination: `/${bridge.id}/${pinId}`,
    modelPath: point.model ?? null, audioPath: point.audio ?? null, videoPath: point.video ?? null, imagePath: point.image ?? null,
    modelSizeMeters: .8, videoWidthMeters: 1.2, scale: 1, rotation: [0, 0, 0] as [number, number, number],
  };
}) }));
