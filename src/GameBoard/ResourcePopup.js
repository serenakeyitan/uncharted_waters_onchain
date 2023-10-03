import React from 'react';

const ResourcePopup = ({ hoveredIsland, popupPosition, islandOwnership, mineResource }) => {
  
  if (!hoveredIsland || !popupPosition) {
    return null;
  }
  
  console.log("hoveredIsland at the start of ResourcePopup:", hoveredIsland);

  console.log('Hovered Island Data:', hoveredIsland);
  console.log('ResourcePopup component is rendering.');
  console.log('Island Ownership in ResourcePopup:', islandOwnership);

  if (!hoveredIsland || typeof hoveredIsland !== 'object') {
    console.error("hoveredIsland is not an object:", hoveredIsland);
    return null;
  }

  console.log("Does hoveredIsland.resource exist?", !!hoveredIsland.resource);
  console.log("Value of hoveredIsland.resource:", hoveredIsland.resource);

  console.log("Is hoveredIsland.amount greater than 0?", hoveredIsland.amount > 0);
  console.log("Value of hoveredIsland.amount:", hoveredIsland.amount);

  console.log("Does islandOwnership[hoveredIsland.islandId] equal 'You'?", islandOwnership[hoveredIsland.islandId] === "You");
  console.log("Value of islandOwnership[hoveredIsland.islandId]:", islandOwnership[hoveredIsland.islandId]);

  // Do not render anything if essential props are missing


  const handleMine = (resource, islandId) => {
    if (mineResource) {
      mineResource(resource, islandId);
    }
  };
  

  console.log("hoveredIsland at the start of ResourcePopup:", hoveredIsland);


  const owner = islandOwnership ? (islandOwnership[hoveredIsland.islandId] || "Unowned") : "Unowned";


  // Extract the islandId and its data from hoveredIsland
  const [islandId, islandData] = Object.entries(hoveredIsland)[0];

  // Check if the island is owned by the player
  const isOwnedByPlayer = islandOwnership[islandId] === 1;

  // Check if the island has resources
  const hasResources = islandData && Object.values(islandData).some(amount => amount > 0);


  return (
    <div style={{
      position: 'fixed',
      left: `${popupPosition.x}px`,
      top: `${popupPosition.y}px`,
      backgroundColor: 'rgba(0, 0, 0, 0.8)', 
      color: '#fff', 
      fontFamily: 'serif', 
      border: '2px solid #333',
      zIndex: 1000,
      padding: '10px',
      borderRadius: '5px',
      maxWidth: '300px',
    }}>
      {/* Handle direct resource grid details */}
      {hoveredIsland.resource && hoveredIsland.amount && (
         <>
         {console.log('Ownership Data:', islandOwnership)}
         {console.log('Island ID for hovered island:', hoveredIsland.islandId)}
        <div>
          <p style={{ fontWeight: 'bold' }}>Owner: {islandOwnership[hoveredIsland.islandId] || "Unowned"}</p>
          {islandOwnership[hoveredIsland.islandId] === "You" && <p>You can withdraw your stake.</p>}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p>{hoveredIsland.resource}: {hoveredIsland.amount}</p>

            {/* {islandOwnership[hoveredIsland.islandId] === "You" && typeof hoveredIsland.amount === "number" && hoveredIsland.amount > 0 && (
              <button onClick={() => handleMine(hoveredIsland.resource, hoveredIsland.islandId)}>Mine</button>
            )} */}
          </div>
        </div>
        </>
      )}

      {/* Handle island details without displaying owner again for direct resource grids */}
      {/* Handle island details */}
      {!hoveredIsland.resource && Object.keys(hoveredIsland).map((islandId) => {
        const islandData = hoveredIsland[islandId];
        if (typeof islandData !== 'object') return null;
        
        const validResourceEntries = Object.entries(islandData).filter(([key, value]) => 
          key && typeof key === 'string' && key.trim() && value !== null && key !== "null"
        );
        if (!validResourceEntries.length) return null;
        
        return (
          <div key={islandId} style={{ marginBottom: '10px' }}>
            <p style={{ fontWeight: 'bold' }}>Owner: {islandOwnership[islandId] || "Unowned"}</p>
            {validResourceEntries.map(([resourceType, amount]) => (
              <div key={resourceType} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ margin: '4px 0' }}>{resourceType}: {amount}</p>
                {/* {isOwnedByPlayer && hasResources && (
                  <button onClick={() => handleMine(islandData.resource, islandId)}>Mine</button>
                )} */}
              </div>
            ))}
          </div>
        );
      })}

    </div>
  );
  
};

export default ResourcePopup;