export const generateIsland = (x, y, advancedResource, board, islandId, newIslandResources) => {
    const baseResources = ['Wood', 'Stone', 'Cotton'];
    let island = new Set([`${x}-${y}`]);
    let current = [x, y];
    let baseResourceCount = { 'Wood': 0, 'Stone': 0, 'Cotton': 0 };
    let advancedResourceCount = 0;
    let emptyGridCount = 0;
  
    while (island.size < 19) {
      const neighbors = [
        [current[0] - 1, current[1]],
        [current[0] + 1, current[1]],
        [current[0], current[1] - 1],
        [current[0], current[1] + 1],
      ];
  
      const validNeighbors = neighbors.filter(([nx, ny]) => {
        const key = `${nx}-${ny}`;
        return !island.has(key);
      });
  
      if (validNeighbors.length === 0) {
        return generateIsland(x, y, advancedResource, board, islandId, newIslandResources);
    }
  
      const randomIndex = Math.floor(Math.random() * validNeighbors.length);
      current = validNeighbors[randomIndex];
      const key = `${current[0]}-${current[1]}`;
      island.add(key);
    }
  
    // Place resources on the island
    island.forEach((cell) => {
      const [cx, cy] = cell.split('-').map(Number);
      const randomBaseResource = baseResources[Math.floor(Math.random() * baseResources.length)];
  
      if (baseResourceCount[randomBaseResource] < 2) {
        board[cx][cy] = { type: 'Light Soil', resource: randomBaseResource, amount: 100, islandId: islandId };
        baseResourceCount[randomBaseResource]++;
      } else if (advancedResource && advancedResourceCount < 1) {
        board[cx][cy] = { type: 'Light Soil', resource: advancedResource, amount: 100, islandId: islandId };
        advancedResourceCount++;
      } else {
        board[cx][cy] = { type: 'Empty Grid', resource: null, amount: 0, islandId: islandId };
      }
      if (board[cx][cy].resource === null) {
        emptyGridCount++;
      }
    });

    if (newIslandResources && !newIslandResources[islandId]) {
        newIslandResources[islandId] = {};
      }
      newIslandResources[islandId]['Empty Grid'] = emptyGridCount;
  
    // Check for base resources
    if (Object.values(baseResourceCount).some(count => count < 1)) {
      console.error("Base resource condition not met");
    }

  
    // Check for advanced resources
    if (advancedResource && advancedResourceCount !== 1) {
      console.error("Advanced resource condition not met");
    }

    return emptyGridCount;
  };


export const BASE_RESOURCE_AMOUNT = 200;
export const ADVANCED_RESOURCE_AMOUNT = 100;
  