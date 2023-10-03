let mineInterval = null;

export const startMining = (mineResource, resourceType, islandId) => {
  mineInterval = setInterval(() => {
    mineResource(resourceType, islandId);
  }, 1000);
};

export const stopMining = () => {
  if (mineInterval) {
    clearInterval(mineInterval);
    mineInterval = null;
  }
};
