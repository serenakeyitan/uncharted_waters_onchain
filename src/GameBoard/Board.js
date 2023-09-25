import React, { useState, useEffect } from 'react';
import './Board.css';
import ResourcePopup from './ResourcePopup';
import ResourceLegend from './ResourceLegend';  // Import ResourceLegend

const aggregateResources = (islandResources) => {
  const resourceAmounts = {};

  for (const islandId in islandResources) {
    const island = islandResources[islandId];
    if (island) {
      for (const resourceType in island) {
        if (resourceType !== 'null' && resourceType !== 'Empty Grid' && resourceType !== 'undefined') {
          if (!resourceAmounts[resourceType]) {
            resourceAmounts[resourceType] = 0;
          }
          resourceAmounts[resourceType] += island[resourceType];
        }
      }
    }
  }

  return resourceAmounts;
};


const Board = ({ board, islandResources }) => {
  
  const [hoveredIsland, setHoveredIsland] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [resourceAmounts, setResourceAmounts] = useState({});
  const [player, setPlayer] = useState({ id: 1, balance: 1000, inventory: {} });


  // const handleIslandClick = (cell) => {
  //   if (islandOwnership[cell.islandId] === undefined && player.balance >= 100) {
  //     setSelectedIsland(cell.islandId);
  //     stakeIsland(cell.islandId);  // Automatically stake after selecting the island
  //   }
  // };
  

  // Recalculate the resourceAmounts whenever islandResources change
  useEffect(() => {
    const newResourceAmounts = aggregateResources(islandResources);
    console.log("New resource amounts:", newResourceAmounts);
    setResourceAmounts(aggregateResources(islandResources));
  }, [islandResources]);

  console.log("Props in Board component:", islandResources);



  const hexRadius = 10;
  const hexWidth = Math.sqrt(3) * hexRadius;
  const hexHeight = 2 * hexRadius;
  const vertDist = hexHeight * 3 / 4;

  const fillColor = (cell) => {
    // if (cell === 'Sea') return 'blue';
    if (cell === 'Sea') return '#0077be'; // Blue for sea
    if (cell.type === 'Empty Grid') return '#FFFFFF';
    // switch (cell.resource) {
    //   case 'Wood': return '#5E2C04';
    //   case 'Stone': return '#808080';
    //   case 'Cotton': return '#F4F186';
    //   case 'Iron': return '#D3D3D3';
    //   case 'Coal': return '#000000';
    //   case 'Copper': return '#D2691E';
    //   case 'Uranium': return '#ADFF2F';
    //   default: return 'brown';
    // }
    switch (cell.resource) {
        case 'Wood': return '#8B4513'; // Brown for Wood
        case 'Stone': return '#808080'; // Gray for Stone
        case 'Cotton': return '#FFD700'; // Gold for Cotton
        case 'Iron': return '#D3D3D3'; // Light Gray for Iron
        case 'Coal': return '#000000'; // Black for Coal
        case 'Copper': return '#FFA500'; // Copper for Copper
        case 'Uranium': return '#00FF00'; // Green for Uranium
        default: return 'brown'; // Default color
      }
  };

  
  const [islandOwnership, setIslandOwnership] = useState({});
  const [selectedIsland, setSelectedIsland] = useState(null);

  const stakeIsland = () => {
    if (selectedIsland !== null && player.balance >= 100 && !islandOwnership[selectedIsland]) {
      // Update player balance
      setPlayer(prevState => ({ ...prevState, balance: prevState.balance - 100 }));
      
      // Update island ownership
      setIslandOwnership(prevState => ({ ...prevState, [selectedIsland]: player.id }));
      
      // Deselect the island
      setSelectedIsland(null);
    }
  };


  const withdrawStake = (islandId) => {
    if (islandOwnership[islandId] === player.id) {
      setPlayer(prevState => ({ ...prevState, balance: prevState.balance + 100 }));
      
      setIslandOwnership(prevState => {
        const newOwnership = { ...prevState };
        delete newOwnership[islandId];
        return newOwnership;
      });
      
      setSelectedIsland(null);  // Deselect the island
    }
  };

  const handleMouseEnter = (cell, event) => {
    console.log("Mouse entered");
    console.log("cell:", cell);
    console.log("islandResources:", islandResources);
  
    if (cell === 'Sea') {
      // Handle sea cells
      return;
    }
  
    if (cell && cell.islandId !== null && islandResources) {
      const islandResource = islandResources[cell.islandId];
      if (islandResource) {
        setHoveredIsland({ [cell.islandId]: islandResource });  // Update this line
        setPopupPosition({ x: event.clientX, y: event.clientY });
      } else {
        console.error(`No island resource found for islandId: ${cell.islandId}`);
      }
    } else {
      console.error("cell or islandId or islandResources is undefined");
    }
  };

  const handleIslandClick = (cell) => {
    if (cell !== 'Sea' && (islandOwnership[cell.islandId] === undefined || islandOwnership[cell.islandId] === player.id)) {
      setSelectedIsland(prevSelected => (prevSelected === cell.islandId ? null : cell.islandId));
    }
  };
  

  const handleMouseLeave = () => {
    setHoveredIsland(null);
  };

  

  return (
    <div className="game-board">
      
      {/* Insert player info UI here */}
      <div className="player-info">  
        <div className="balance-container">
          {/* Player balance */}
          <p className={player.balance < 100 ? 'balance-red' : 'balance-green'}>
            Player Balance: <span style={{ fontFamily: 'Old English Text MT, serif' }}>{player.balance.toLocaleString()}</span>
          </p>
        </div>

        {selectedIsland !== null && islandOwnership[selectedIsland] === player.id && (
          <button
            className="withdraw-button"
            onClick={() => withdrawStake(selectedIsland)}
          >
            Withdraw
          </button>
        )}
        {selectedIsland !== null && (
          <button onClick={stakeIsland}>Stake Selected Island</button>
        )}
      </div>

      <ResourceLegend resourceAmounts={resourceAmounts} />

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
          const isSelected = selectedIsland === cell.islandId;

          return (
            <g
              key={`${i}-${j}`}
              className={`cell ${isSelected ? 'selected' : ''}`}
              onClick={() => handleIslandClick(cell)}
              onMouseEnter={(e) => handleMouseEnter(cell, e)}
              onMouseLeave={handleMouseLeave}
            >
              <polygon points={points} fill={fillColor(cell)} />
            </g>
          );
        }))}
       </svg>
      <ResourcePopup 
        hoveredIsland={hoveredIsland} 
        popupPosition={popupPosition} 
        islandOwnership={islandOwnership} 
        />
    </div>
  );
};

export default Board;
