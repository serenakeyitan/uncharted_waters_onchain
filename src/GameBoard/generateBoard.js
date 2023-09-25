import { generateIsland } from './generateIsland';

let IslandId = 0; // Initialize islandId counter
let newIslandResources = {}; // Initialize newIslandResources

export const generateBoard = () => {
  const board = Array.from({ length: 100 }, () => Array(100).fill('Sea'));
//   const baseResources = ['Wood', 'Stone', 'Cotton'];
  const advancedResources = ['Iron', 'Coal', 'Copper', 'Uranium'];
  const islandCenters = [];
  const emptyGridCounts = {}; // To store the count of empty grids for each island

  const distanceBetweenPoints = (x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };

  const isFarEnough = (x, y) => {
    return islandCenters.every(([ix, iy]) => {
      return distanceBetweenPoints(x, y, ix, iy) >= 15;
    });
  };

  for (let i = 0; i < 15; i++) {
    let x, y;
    do {
      x = Math.floor(Math.random() * 90) + 5;
      y = Math.floor(Math.random() * 90) + 5;
    } while (!isFarEnough(x, y));

    islandCenters.push([x, y]);

    let advancedResource = null;
    if (i < 4) {
      advancedResource = advancedResources.splice(Math.floor(Math.random() * advancedResources.length), 1)[0];
    }

    const emptyGridCount = generateIsland(x, y, advancedResource, board, IslandId, newIslandResources);
    emptyGridCounts[IslandId] = emptyGridCount; // Store the count of empty grids for this island

    IslandId++; // Increment for the next island
  }

  return {
    board,
    newIslandResources,
    emptyGridCounts // Return the count of empty grids for each island
  };
};
