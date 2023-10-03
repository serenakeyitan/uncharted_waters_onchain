import React, { useState, useEffect } from 'react';
import './Board.css';
import ResourcePopup from './ResourcePopup';
import ResourceLegend from './ResourceLegend';  // Import ResourceLegend
import { useMining } from './mining.js';
import PlayerInventory from './playerInventory';



const aggregateResources = (islandResources) => {

  console.log("Current islandResources:", islandResources);

  const resourceAmounts = {};

  for (const islandId in islandResources) {
    const island = islandResources[islandId];
    if (island) {
      console.log(`Processing islandId ${islandId}`);
      for (const resourceType in island) {
        if (resourceType !== 'null' && resourceType !== 'Empty Grid' && resourceType !== 'undefined') {
          if (!resourceAmounts[resourceType]) {
            resourceAmounts[resourceType] = 0;
            
          }
          if (typeof island[resourceType] === "number") {
            resourceAmounts[resourceType] += island[resourceType];
          } else {
            console.error(`Invalid value for resourceType ${resourceType} in island ${islandId}:`, island[resourceType]);
          }
          
        }
      }
    }
  }

  return resourceAmounts;
};


const Board = ({ board, islandResources }) => {

  const [hoveredIsland, setHoveredIsland] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [resourceAmounts, setResourceAmounts] = useState(islandResources || {});
  console.log(islandResources, resourceAmounts);
  console.log('Initial resourceAmounts:', resourceAmounts);
  const [player, setPlayer] = useState({ id: 1, balance: 1000, inventory: {} });
  const [selectedCell, setSelectedCell] = useState(null);



  // const handleIslandClick = (cell) => {
  //   if (islandOwnership[cell.islandId] === undefined && player.balance >= 100) {
  //     setSelectedIsland(cell.islandId);
  //     stakeIsland(cell.islandId);  // Automatically stake after selecting the island
  //   }
  // };
  console.log("islandResource:", islandResources);

  const {
    resourceAmounts: minedResourceAmounts,
    setResourceAmounts: setMinedResourceAmounts,
    startMining,
    stopMining,
    mineResource: mineUsingHook  // Rename the function from the hook
  } = useMining(islandResources);

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

  useEffect(() => {
    console.log('selectedIsland changed:', selectedIsland);
  }, [selectedIsland]);
  


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
        console.log('Current state of islandResources:', islandResources); // Log the current state
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

  const [showMinePopup, setShowMinePopup] = useState(false);

  const handleRightClick = (e, cell) => {
    e.preventDefault(); // Prevent the default context menu from appearing
    // debug: the mine did not show in popupwindow
    if (cell !== 'Sea' && islandOwnership[cell.islandId] === player.id) {
      const islandResource = islandResources[cell.islandId];
      if (islandResource && islandResource[cell.resource] > 0) {
        const rect = e.target.getBoundingClientRect();
        setPopupPosition({ x: rect.left + window.scrollX, y: rect.top + window.scrollY }); // Set the position based on the SVG grid's coordinates
        setSelectedCell(cell); // Set the selected cell to the one that was right-clicked
        setShowMinePopup(true); // Show the "Mine" button
      }
    }
    // stop debug: the mine did not show in popupwindow 
  };

// Debug for mining issue
console.log('Selected Island:', selectedIsland);
console.log('Resource Amounts:', resourceAmounts);


const mineResource = (cell) => {
  console.log('mining resource for cell:', cell);
  console.log('current selectedIsland:', selectedIsland);

  // Check if the islandResources exist and if the specific islandId is defined in it
  if (!islandResources) {
    console.error("islandResources is undefined");
    return;
  }

  if (!islandResources[cell.islandId]) {
    console.error(`islandResources for specific islandId ${cell.islandId} is undefined`);
    console.log('Current state of islandResources:', islandResources); // Log the current state
    return;
  }

  // Check if the islandId and resource from the cell are valid
  if (!cell.islandId || !cell.resource) {
    console.error("Either islandId or resource from cell is missing");
    return;
  }

  // Check if the islandResources exist and if the specific islandId is defined in it
  if (!islandResources || !islandResources[cell.islandId]) {
    console.error("islandResources or islandResources for specific islandId is undefined");
    return;
  }

  // Check if the resource exists for the specific islandId in islandResources
  if (islandResources[cell.islandId][cell.resource] === undefined) {
    console.error(`Resource ${cell.resource} doesn't exist for islandId: ${cell.islandId}`);
    return;
  }

  if (!islandResources[cell.islandId]) {
    console.error(`Island with id ${cell.islandId} does not exist in resources. Current state of islandResources:`, islandResources);
    return;
  }
  

  // Update the resources
  setResourceAmounts((prevResources) => {
    const updatedResources = { ...prevResources };

    // Ensure that the island exists in updatedResources
    if (!updatedResources[cell.islandId]) {
      console.error(`Island with id ${cell.islandId} does not exist in resources`);
      return prevResources;
    }


    // Ensure that the resource exists for the island in updatedResources
    if (!updatedResources[cell.islandId][cell.resource]) {
      console.error(`Resource ${cell.resource} does not exist for island ${cell.islandId}`);
      return prevResources;
    }

    updatedResources[cell.islandId][cell.resource] -= 1;

    return updatedResources;
  });

  // Update player inventory
  setPlayer((prevState) => {
    const updatedInventory = { ...prevState.inventory };
    if (!updatedInventory[cell.resource]) {
      updatedInventory[cell.resource] = 0;
    }
    updatedInventory[cell.resource] += 1;
    return { ...prevState, inventory: updatedInventory };
  });
};


// debug ownership of island
console.log('Island Ownership in Parent:', islandOwnership);


  

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
              onContextMenu={(e) => handleRightClick(e, cell)}
              onMouseEnter={(e) => handleMouseEnter(cell, e)}
              onMouseLeave={handleMouseLeave}
            >
              <polygon points={points} fill={fillColor(cell)} />
            </g>
          );
        }))}
      {/* place the inventory below the board */}
      <PlayerInventory inventory={player.inventory} />
       </svg>


       {showMinePopup && selectedCell && (
        <button
          style={{
            position: 'absolute',
            left: `${popupPosition.x}px`,
            top: `${popupPosition.y}px`,
            zIndex: 1000
          }}
          onClick={() => {
            mineResource(selectedCell);
            setShowMinePopup(false); // Close the "Mine" button after mining
          }}
        >
          Mine
        </button>
      )}


      {hoveredIsland && popupPosition && (
        <ResourcePopup 
          hoveredIsland={hoveredIsland} 
          popupPosition={popupPosition} 
          islandOwnership={islandOwnership} 
          // mineResource={mineResource}
          show={showMinePopup}
        />
      )}
    </div>
  );
};

export default Board;