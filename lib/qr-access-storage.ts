const prefix = 'between-bridges:qr-access:v1:';
export const qrAccessKey = (bridgeId: string, spotId: string) => `${prefix}${bridgeId}:${spotId}`;

export function readQRAccess(storage: Pick<Storage, 'getItem'>, bridgeId: string, spotId: string) {
  try { return storage.getItem(qrAccessKey(bridgeId, spotId)) === 'unlocked'; }
  catch { return false; }
}

export function writeQRAccess(storage: Pick<Storage, 'setItem'>, bridgeId: string, spotId: string) {
  try { storage.setItem(qrAccessKey(bridgeId, spotId), 'unlocked'); return true; }
  catch { return false; }
}
