export const PLANS = {
  FREE: {
    maxVideos: 15,
    maxVideoSize: 250 * 1024 * 1024, // 250MB
    maxDuration: 10 * 60,
    maxStorage: 15 * 250 * 1024 * 1024,
    quality: "1080p",
    allowRaw: false,
  },
  CREATOR: {
    maxVideos: 100,
    maxVideoSize: 2 * 1024 * 1024 * 1024, // 2GB
    maxDuration: 30 * 60,
    maxStorage: 100 * 2 * 1024 * 1024 * 1024,
    quality: "4K",
    allowRaw: true,
  },
  PRO: {
    maxVideos: Infinity,
    maxVideoSize: 5 * 1024 * 1024 * 1024, // 5GB
    maxDuration: 2 * 60 * 60,
    maxStorage: Infinity,
    quality: "4K",
    allowRaw: true,
  },
};
