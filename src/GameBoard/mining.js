import { useState } from 'react';

export const useMining = (initialResources) => {
  const [resourceAmounts, setResourceAmounts] = useState(initialResources);
  const [miningInterval, setMiningInterval] = useState(null);
  const [playerInventory, setPlayerInventory] = useState({});

  const startMining = (cell, mineResourceCallback) => {
    if (miningInterval) {
      clearInterval(miningInterval); // Clear any existing mining intervals
    }

    const interval = setInterval(() => {
      mineResourceCallback(cell);
    }, 1000); // Mine every second

    setMiningInterval(interval);
  };

  const stopMining = () => {
    if (miningInterval) {
      clearInterval(miningInterval);
      setMiningInterval(null);
    }
  };

  const mineResource = (cell) => {
    if (resourceAmounts[cell.islandId] && resourceAmounts[cell.islandId][cell.resource] > 0) {
      // Decrement the resource from the island
      setResourceAmounts(prevResources => ({
        ...prevResources,
        [cell.islandId]: {
          ...prevResources[cell.islandId],
          [cell.resource]: prevResources[cell.islandId][cell.resource] - 1
        }
      }));

      // Add the resource to the player's inventory
      setPlayerInventory(prevInventory => ({
        ...prevInventory,
        [cell.resource]: (prevInventory[cell.resource] || 0) + 1
      }));

      // If the resource on the island is depleted, stop mining
      if (resourceAmounts[cell.islandId][cell.resource] <= 0) {
        stopMining();
      }
    } else {
      stopMining();
    }
  };

  return {
    resourceAmounts,
    setResourceAmounts,
    startMining,
    stopMining,
    mineResource,
    playerInventory
  };
};
