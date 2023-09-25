import React, { useState, useEffect } from 'react';
import ResourceLegend from '../ResourceLegend';

const generateBoard = () => {
  const board = Array.from({ length: 100 }, () => Array(100).fill('Sea'));
  const baseResources = ['Wood', 'Stone', 'Cotton'];
  const advancedResources = ['Iron', 'Coal', 'Copper', 'Uranium'];
  const islandCenters = [];
  const advancedIslands = [];

  const distanceBetweenPoints = (x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };

  const isFarEnough = (x, y) => {
    return islandCenters.every(([ix, iy]) => {
      return distanceBetweenPoints(x, y, ix, iy) >= 10;
    });
  };

  const generateIsland = (x, y, islandSize, advancedResource) => {
    let resourceCount = { Wood: 0, Stone: 0, Cotton: 0 };
    let visited = new Set();
    let queue = [[x, y]];
  
    while (visited.size < islandSize && queue.length > 0) {
      const [currentX, currentY] = queue.shift();
      const resource = baseResources[Math.floor(Math.random() * baseResources.length)];
  
      if (resourceCount[resource] < 4) {
        board[currentX][currentY] = { type: 'Light Soil', resource, amount: 100 };
        resourceCount[resource]++;
      }
  
      visited.add(`${currentX}-${currentY}`);
  
      let neighbors = [
        [currentX - 1, currentY],
        [currentX + 1, currentY],
        [currentX, currentY - 1],
        [currentX, currentY + 1]
      ];
  
      neighbors = neighbors.filter(([nx, ny]) => {
        return nx >= 0 && nx < 100 && ny >= 0 && ny < 100 && !visited.has(`${nx}-${ny}`);
      });
  
      // Shuffle neighbors to add randomness
      neighbors.sort(() => Math.random() - 0.5);
  
      queue.push(...neighbors);
    }
  
    if (advancedResource) {
      board[x][y] = { type: 'Light Soil', resource: advancedResource, amount: 100 };
      board[x + 1][y] = { type: 'Light Soil', resource: advancedResource, amount: 100 };
    }
  };
  
  
  

  for (let i = 0; i < 15; i++) {
    let x, y;
    do {
      x = Math.floor(Math.random() * 90);
      y = Math.floor(Math.random() * 90);
    } while (!isFarEnough(x, y));

    islandCenters.push([x, y]);

    let advancedResource = null;
    if (advancedIslands.length < 4) {
      advancedResource = advancedResources.splice(Math.floor(Math.random() * advancedResources.length), 1)[0];
      advancedIslands.push(advancedResource);
    }

    generateIsland(x, y, 20, advancedResource);
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
    switch (cell.resource) {
      case 'Wood': return '#A52A2A'; // brown
      case 'Stone': return '#808080'; // darker grey
      case 'Cotton': return '#FFFFE0'; // super light yellow
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

