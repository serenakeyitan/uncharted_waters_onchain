import React, { useState, useEffect } from 'react';
import ResourceLegend from '../ResourceLegend';

const generateBoard = () => {
  const board = Array.from({ length: 100 }, () => Array(100).fill('Sea'));
  const baseResources = ['Wood', 'Stone', 'Cotton'];
  const advancedResources = ['Iron', 'Coal', 'Copper', 'Uranium'];
  const islandCenters = [];

  const distanceBetweenPoints = (x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };

  const isFarEnough = (x, y) => {
    return islandCenters.every(([ix, iy]) => {
      return distanceBetweenPoints(x, y, ix, iy) >= 8;
    });
  };

  

const generateIsland = (x, y, advancedResource) => {
  let island = new Set([`${x}-${y}`]);
  let current = [x, y];
  let baseResourceCount = 0;
  let advancedResourceCount = 0;

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
      // If we can't expand the island anymore, start over
      return generateIsland(x, y, advancedResource);
    }

    const randomIndex = Math.floor(Math.random() * validNeighbors.length);
    current = validNeighbors[randomIndex];
    const key = `${current[0]}-${current[1]}`;
    island.add(key);
  }

  // Place resources on the island
  island.forEach((cell) => {
    const [cx, cy] = cell.split('-').map(Number);
    if (baseResourceCount < 9) {
      const resource = ['Wood', 'Stone', 'Cotton'][Math.floor(Math.random() * 3)];
      board[cx][cy] = { type: 'Light Soil', resource, amount: 100 };
      baseResourceCount++;
    } else if (advancedResource && advancedResourceCount < 2) {
      board[cx][cy] = { type: 'Light Soil', resource: advancedResource, amount: 100 };
      advancedResourceCount++;
    } else {
      board[cx][cy] = { type: 'Empty Grid', resource: null, amount: 0 };
    }
  });

  // Check for base resources
  if (baseResourceCount !== 9) {
    console.error("Base resource condition not met");
  }

  // Check for advanced resources
  if (advancedResource && advancedResourceCount !== 2) {
    console.error("Advanced resource condition not met");
  }
};


  
  // Existing code for generating islands
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
  
    generateIsland(x, y, advancedResource);
  }
  
  return board;
};

const App = () => {
  const [board, setBoard] = useState([]);

  useEffect(() => {
    setBoard(generateBoard());
  }, []);

  const hexRadius = 10;
  const hexWidth = Math.sqrt(3) * hexRadius;
  const hexHeight = 2 * hexRadius;
  const vertDist = hexHeight * 3 / 4;

  const fillColor = (cell) => {
    if (cell === 'Sea') return 'blue';
    if (cell.type === 'Empty Grid') return '#FFFFFF'; // Add this line for empty grid
    switch (cell.resource) {
      case 'Wood': return '#A52A2A'; // brown
      case 'Stone': return '#808080'; // darker grey
      case 'Cotton': return '#F4F186'; // super light yellow
      case 'Iron': return '#D3D3D3'; // light grey
      case 'Coal': return '#000000'; // black
      case 'Copper': return '#D2691E'; // golden brown
      case 'Uranium': return '#ADFF2F'; // shiny green
      default: return 'brown';
    }
  };
  
  

  return (
    <div>
    <ResourceLegend />
      <svg width="2000" height="2000">
        {board.map((row, i) => row.map((cell, j) => {
          const x = hexWidth * j + (i % 2 === 1 ? hexWidth / 2 : 0);
          const y = vertDist * i;
          const points = Array.from({ length: 6 }, (_, k) => {
            const angle = (Math.PI / 180) * (60 * k - 30);
            const xPoint = x + hexRadius * Math.cos(angle);
            const yPoint = y + hexRadius * Math.sin(angle);
            return `${xPoint},${yPoint}`;
          }).join(' ');

          return (
            <g key={`${i}-${j}`}>
              <polygon points={points} fill={fillColor(cell)} />
            </g>
          );
        }))}
      </svg>
    </div>
  );
};


export default App;

