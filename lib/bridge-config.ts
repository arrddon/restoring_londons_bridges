export type Spot = {
  id: string; bridgeId: string; title: string;
  pinId: string; assetType: '3d' | 'video' | 'image';
  sourceAssets: { model: string | null; audio: string | null; video: string | null; image: string | null };
  contentDurationSeconds: number | null;
  position: { x: number; y: number };
  destination: string; modelPath: string | null; audioPath: string | null; videoPath: string | null; imagePath: string | null;
  modelSizeMeters: number; videoWidthMeters: number;
  scale: number; rotation: [number, number, number];
};
export type Bridge = { id: string; title: string; mapPath: string; mapWidth: number; mapHeight: number; mapFocusY: number; landscapeAngle: number; spots: Spot[] };
// Normalized image coordinates (0–1). Positions remain provisional.
const positions = [{ x: .275, y: .235 }, { x: .40, y: .31 }, { x: .52, y: .38 }, { x: .65, y: .455 }, { x: .775, y: .53 }];
const albertPositions = [{ x: .405, y: .25 }, { x: .465, y: .375 }, { x: .525, y: .50 }, { x: .585, y: .625 }, { x: .645, y: .75 }];
type SpotContent = Pick<Spot, 'title' | 'assetType' | 'contentDurationSeconds' | 'modelPath' | 'audioPath' | 'videoPath' | 'imagePath'>;
const content: Record<string, SpotContent[]> = {
  AlbertBridge: [
    { title: '01. Stop Marching Sign', assetType: '3d', contentDurationSeconds: null,
      modelPath: 'https://res.cloudinary.com/douz9wtb2/image/upload/v1789456312/A01_model_xokmyr.glb',
      audioPath: 'https://res.cloudinary.com/douz9wtb2/video/upload/v1789457784/A01_audio_juuptd.mp3', videoPath: null, imagePath: null },
    { title: '02. Timber and Ashphalt', assetType: '3d', contentDurationSeconds: null,
      modelPath: 'https://res.cloudinary.com/douz9wtb2/image/upload/v1789456319/A02_model_qra1kg.glb',
      audioPath: 'https://res.cloudinary.com/douz9wtb2/video/upload/v1789456316/A02_audio_q0sipu.mp3', videoPath: null, imagePath: null },
    { title: '03. Bazalgette', assetType: 'video', contentDurationSeconds: null, modelPath: null, audioPath: null,
      videoPath: 'https://res.cloudinary.com/douz9wtb2/video/upload/v1789456330/A03_video_uhoagu.mp4', imagePath: null },
    { title: '04. Lights on the Bridge', assetType: 'image', contentDurationSeconds: null, modelPath: null,
      audioPath: 'https://res.cloudinary.com/douz9wtb2/video/upload/v1789456314/A04_audio_ljpesh.mp3', videoPath: null,
      imagePath: 'https://res.cloudinary.com/douz9wtb2/image/upload/v1789456311/A04_image_hwgvpn.jpg' },
    { title: '05. The Damaged Rocker', assetType: '3d', contentDurationSeconds: null,
      modelPath: 'https://res.cloudinary.com/douz9wtb2/image/upload/v1789456323/A05_model_okrfgz.glb',
      audioPath: 'https://res.cloudinary.com/douz9wtb2/video/upload/v1789457947/A05_audio_mocwxx.mp3', videoPath: null, imagePath: null },
  ],
  HammersmithBridge: [
    { title: '01. Silvertown Tunnel', assetType: '3d', contentDurationSeconds: null,
      modelPath: 'https://res.cloudinary.com/douz9wtb2/image/upload/v1789457355/H01_model_dh03cv.glb',
      audioPath: 'https://res.cloudinary.com/douz9wtb2/video/upload/v1789456289/H01_audio_fopekz.mp3', videoPath: null, imagePath: null },
    { title: '02. Boat Race', assetType: 'video', contentDurationSeconds: null, modelPath: null, audioPath: null,
      videoPath: 'https://res.cloudinary.com/douz9wtb2/video/upload/v1789456304/H02_video_yszts1.mp4', imagePath: null },
    { title: '03. Bazalgette', assetType: '3d', contentDurationSeconds: null,
      modelPath: 'https://res.cloudinary.com/douz9wtb2/image/upload/v1789456294/H03_model_raopgc.glb',
      audioPath: 'https://res.cloudinary.com/douz9wtb2/video/upload/v1789456289/H03_audio_khl7dt.mp3', videoPath: null, imagePath: null },
    { title: '04. Weather Data', assetType: 'image', contentDurationSeconds: 60, modelPath: null, audioPath: null, videoPath: null,
      imagePath: 'https://res.cloudinary.com/douz9wtb2/image/upload/v1789456288/H04_image_xfq0jx.jpg' },
    { title: '05. IRA Bombing', assetType: 'video', contentDurationSeconds: null, modelPath: null, audioPath: null,
      videoPath: 'https://res.cloudinary.com/douz9wtb2/video/upload/v1789456307/H05_video_t7eleh.mp4', imagePath: null },
  ],
};
export const bridges: Bridge[] = [
  { id: 'AlbertBridge', title: 'Albert Bridge', mapPath: '/Assets/Maps/map_AB_v3.png', mapWidth: 941, mapHeight: 1672, mapFocusY: .5, landscapeAngle: 0 },
  { id: 'HammersmithBridge', title: 'Hammersmith Bridge', mapPath: '/Assets/Maps/map_HB_v3.png', mapWidth: 941, mapHeight: 1672, mapFocusY: .5, landscapeAngle: 0 },
].map(bridge => ({ ...bridge, spots: (bridge.id === 'AlbertBridge' ? albertPositions : positions).map((position, i) => {
  const pointContent = content[bridge.id][i];
  return ({
  id: `spot-${String(i + 1).padStart(2, '0')}`, bridgeId: bridge.id,
  pinId: `${bridge.id === 'AlbertBridge' ? 'A' : 'H'}${String(i + 1).padStart(2, '0')}`,
  ...pointContent,
  sourceAssets: {
    model: pointContent.modelPath,
    audio: pointContent.audioPath,
    video: pointContent.videoPath,
    image: pointContent.imagePath,
  },
  position,
  // Public point URLs are encoded directly into the physical QR markers.
  destination: `/${bridge.id}/${bridge.id === 'AlbertBridge' ? 'A' : 'H'}${String(i + 1).padStart(2, '0')}`,
  modelSizeMeters: .8, videoWidthMeters: 1.2,
  scale: 1, rotation: [0, 0, 0] as [number, number, number],
  });
}) }));
