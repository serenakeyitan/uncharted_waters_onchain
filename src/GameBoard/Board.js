import React, { useState, useEffect } from 'react';
import './Board.css';
import ResourcePopup from './ResourcePopup';
import ResourceLegend from './ResourceLegend';  // Import ResourceLegend
import { useMining } from './mining.js';
import PlayerInventory from './playerInventory';
import { BASE_RESOURCE_AMOUNT, ADVANCED_RESOURCE_AMOUNT } from './generateIsland';  // Adjust the path as needed



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
  const [gameTime, setGameTime] = useState(0); // Time in seconds or any other unit you prefer
  const [hoveredIsland, setHoveredIsland] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [resourceAmounts, setResourceAmounts] = useState(islandResources || {});
  console.log(islandResources, resourceAmounts);
  console.log('Initial resourceAmounts:', resourceAmounts);
  const [player, setPlayer] = useState({ id: 1, balance: 1000, inventory: {} });
  const [selectedCell, setSelectedCell] = useState(null);
  console.log('Board component rendering...'); // Log to see if the component is re-rendering

  const [isInventoryVisible, setInventoryVisible] = useState(false);

  const toggleInventory = () => {
      setInventoryVisible(!isInventoryVisible);
  };


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

  useEffect(() => {
    const timer = setInterval(() => {
        setGameTime(prevTime => prevTime + 1); // Increment the game time by 1 second
    }, 1000); // 1000 milliseconds = 1 second

    return () => {
        clearInterval(timer); // Clear the interval when the component unmounts
    };
}, []); // Empty dependency array ensures this useEffect runs only once when the component mounts


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
  console.log('mineResource function called with cell:', cell);
  console.log('Resource to be mined:', cell.resource);
  console.log('Island ID:', cell.islandId);
  console.log('current selectedIsland:', selectedIsland);
  console.log('Trying to mine: ', cell.resource);
  console.log("Resource amounts before update:", resourceAmounts);

  // Update the resources
  setResourceAmounts((prevResources) => {
    const updatedResources = { ...prevResources };

    // Ensure the islandId exists in updatedResources and is an object
    if (!updatedResources[cell.islandId]) {
      updatedResources[cell.islandId] = {};
    }

    // If the resource doesn't exist for the islandId, initialize it
    if (updatedResources[cell.islandId][cell.resource] === undefined) {
      const baseResources = ['Wood', 'Stone', 'Cotton'];
      if (baseResources.includes(cell.resource)) {
        updatedResources[cell.islandId][cell.resource] = 200;
      } else {
        updatedResources[cell.islandId][cell.resource] = 100;
      }
    }

    console.log("updatedResources before decrement:", updatedResources);

    // Only decrement if the current amount is greater than 0
    if (updatedResources[cell.islandId][cell.resource] > 0) {
      updatedResources[cell.islandId][cell.resource] -= 1;
    }

    // Check if the resource amount is 0 and stop mining
    if (updatedResources[cell.islandId][cell.resource] === 0) {
      stopMining();
    }

    console.log(`updatedResources for islandId ${cell.islandId} after decrement:`, updatedResources[cell.islandId]);
    console.log('Updated resources for islandId', cell.islandId, ':', updatedResources[cell.islandId]);

    // Update player inventory
    setPlayer((prevState) => {
      const updatedInventory = { ...prevState.inventory };
      if (!updatedInventory[cell.resource]) {
        updatedInventory[cell.resource] = 0;
      }
      // Only increment the player's inventory if there's still resource left on the island
      if (updatedResources[cell.islandId][cell.resource] && updatedResources[cell.islandId][cell.resource] > 0) {
        updatedInventory[cell.resource] += 1;
      } else {
        console.log(`Resource ${cell.resource} on islandId ${cell.islandId} is depleted. Stopping mining.`);
        stopMining();
      }
      console.log('Updated inventory:', updatedInventory); 
      return { ...prevState, inventory: updatedInventory };
    });

    return updatedResources;
  });
};

// Removed the useEffect hook since it's redundant



// debug ownership of island
console.log('Island Ownership in Parent:', islandOwnership);

// return statement starts
return (
  <div className="game-container">
      {isInventoryVisible && (
          <div className="sidebar visible">
              <PlayerInventory inventory={player.inventory} />
          </div>
      )}
      <div className="game-board">
          <button className="toggle-inventory-btn" onClick={toggleInventory}>
              {isInventoryVisible ? "Hide Inventory" : "Show Inventory"}
          </button>

          <div className="player-info">  
              <div className="balance-container">
                  <p className={player.balance < 100 ? 'balance-red' : 'balance-green'}>
                      Player Balance: <span style={{ fontFamily: 'Old English Text MT, serif' }}>{player.balance.toLocaleString()}</span>
                  </p>
              </div>
              <div className="game-time">Game Time: {gameTime} seconds</div>

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
                      console.log('Selected cell when Mine button clicked:', selectedCell);
                      mineResource(selectedCell);          // Mine once immediately
                      startMining(selectedCell, mineResource);
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
                  show={showMinePopup}
              />
          )}
      </div>
  </div>
);

};

export default Board;