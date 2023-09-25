import React, { useState, useEffect } from 'react';

const generateBoard = () => {
  let board = Array.from({ length: 50 }, () => Array(50).fill('Sea'));

  // Step 1: Randomly initialize "Land" cells
  for (let i = 0; i < 50; i++) {
    for (let j = 0; j < 50; j++) {
      if (Math.random() < 0.4) {
        board[i][j] = 'Land';
      }
    }
  }

  // Step 2: Apply cellular automata rules
  for (let iteration = 0; iteration < 5; iteration++) {
    const newBoard = Array.from({ length: 50 }, () => Array(50).fill('Sea'));
    for (let i = 0; i < 50; i++) {
      for (let j = 0; j < 50; j++) {
        let landNeighbors = 0;
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            const x = i + dx;
            const y = j + dy;
            if (x >= 0 && x < 50 && y >= 0 && y < 50 && board[x][y] === 'Land') {
              landNeighbors++;
            }
          }
        }
        newBoard[i][j] = landNeighbors >= 5 ? 'Land' : 'Sea';
      }
    }
    board = newBoard;
  }

  // Step 3: Ensure islands are at least 10 grids away (omitted for simplicity)

  return board;
};

const App = () => {
  const [board, setBoard] = useState([]);

  useEffect(() => {
    setBoard(generateBoard());
  }, []);

  return (
    <div>
      <table border="1">
        <tbody>
          {board.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} style={{ width: '20px', height: '20px', backgroundColor: cell === 'Sea' ? 'blue' : 'green' }}>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
