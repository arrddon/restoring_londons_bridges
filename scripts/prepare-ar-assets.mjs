import { cp, mkdir } from 'node:fs/promises';
await mkdir('public/vendor/8thwall', { recursive: true });
await cp('node_modules/@8thwall/engine-binary/dist', 'public/vendor/8thwall', { recursive: true, force: false });
await cp('Assets/favicon/88d6cafb-5b14-438a-86fe-4678dedee603.jpg', 'public/favicon.jpg', { force: true });
console.log('Local XR engine prepared. Bridge content is delivered by Cloudinary.');
