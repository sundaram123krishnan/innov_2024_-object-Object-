type WatchLater = {
  userId: string;
  toWatchLater: string[];
};

type VideoMetadata = {
  name: string;
  description: string;
};

type WatchHistory = {
  timestamp: number;
  userId: string;
  videoName: string;
};
