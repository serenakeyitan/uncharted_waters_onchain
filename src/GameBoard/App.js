import React, { useState, useEffect } from 'react';
import ResourceLegend from './ResourceLegend';
import Board from './Board';
import { generateBoard } from './generateBoard';

const App = () => {
  const [board, setBoard] = useState([]);
  const [islandResources, setIslandResources] = useState({});

  useEffect(() => {
    const { board: newBoard, emptyGridCounts } = generateBoard();
    setBoard(newBoard);

    const newIslandResources = {};

    newBoard.forEach((row) => {
      row.forEach((cell) => {
        if (cell && cell.islandId !== null) {
          if (!newIslandResources[cell.islandId]) {
            newIslandResources[cell.islandId] = {};
          }
          if (!newIslandResources[cell.islandId][cell.resource]) {
            newIslandResources[cell.islandId][cell.resource] = 0;
          }
          newIslandResources[cell.islandId][cell.resource] += cell.amount;
        }
      });
    });

    Object.keys(emptyGridCounts).forEach((islandId) => {
      if (!newIslandResources[islandId]) {
        newIslandResources[islandId] = {};
      }
      newIslandResources[islandId]['Empty Grid'] = emptyGridCounts[islandId];
    });

    setIslandResources(newIslandResources);
  }, []);

  return (
    <div>
      <ResourceLegend />
      <Board board={board} islandResources={islandResources} />
    </div>
  );
};

export default App;
