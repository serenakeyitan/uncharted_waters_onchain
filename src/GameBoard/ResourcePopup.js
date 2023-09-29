import React from 'react';

const ResourcePopup = ({ hoveredIsland, popupPosition, islandOwnership, mineResource }) => {
  console.log('Hovered Island Data:', hoveredIsland);
  console.log('Island Ownership in ResourcePopup:', islandOwnership);

  // Do not render anything if essential props are missing
  if (!hoveredIsland || !popupPosition) {
    return null;
  }

  const handleMine = () => {
    if (mineResource) {
      mineResource(hoveredIsland.resource, hoveredIsland.islandId);
    }
  };

  console.log("Attempting to render ResourcePopup with props:", hoveredIsland, popupPosition, islandOwnership);

  const owner = islandOwnership ? (islandOwnership[hoveredIsland.islandId] || "Unowned") : "Unowned";

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
        <div>
          <p style={{ fontWeight: 'bold' }}>Owner: {islandOwnership[hoveredIsland.islandId] || "Unowned"}</p>
          {islandOwnership[hoveredIsland.islandId] === "You" && <p>You can withdraw your stake.</p>}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p>{hoveredIsland.resource}: {hoveredIsland.amount}</p>
            {islandOwnership[hoveredIsland.islandId] === "You" && hoveredIsland.amount > 0 && (
              <button onClick={() => handleMine(hoveredIsland.resource, hoveredIsland.islandId)}>Mine</button>
            )}
          </div>
        </div>
      )}

      {/* Handle island details without displaying owner again for direct resource grids */}
      {hoveredIsland && !hoveredIsland.resource && Object.keys(hoveredIsland).map((islandId) => {
        const islandData = hoveredIsland[islandId];
        if (typeof islandData !== 'object') return null;
        const validResourceEntries = Object.entries(islandData).filter(([key, value]) => 
          key && typeof key === 'string' && key.trim() && value !== null
        );
        if (!validResourceEntries.length) return null;
        return (
          <div key={islandId} style={{ marginBottom: '10px' }}>
            <p style={{ fontWeight: 'bold' }}>Owner: {islandOwnership[islandId] || "Unowned"}</p>
            {validResourceEntries.map(([resourceType, amount]) => (
              <div key={resourceType} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ margin: '4px 0' }}>{resourceType}: {amount}</p>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
  
};

export default ResourcePopup;