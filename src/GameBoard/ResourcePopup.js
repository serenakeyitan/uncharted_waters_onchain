import React from 'react';

const ResourcePopup = ({ hoveredIsland, popupPosition, islandOwnership, mineResource }) => {
  
  if (!hoveredIsland || !popupPosition) {
    return null;
  }

  const handleMine = (resource, islandId) => {
    if (mineResource) {
      mineResource(resource, islandId);
    }
  };

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
          <p style={{ fontWeight: 'bold' }}>Owner: {owner}</p>
          {owner === "You" && <p>You can withdraw your stake.</p>}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p>{hoveredIsland.resource}: {hoveredIsland.amount > 0 ? hoveredIsland.amount : "Depleted"}</p>
          </div>
        </div>
      )}

      {/* Handle island details */}
      {!hoveredIsland.resource && Object.keys(hoveredIsland).map((islandId) => {
        const islandData = hoveredIsland[islandId];
        if (typeof islandData !== 'object') return null;
        
        const validResourceEntries = Object.entries(islandData).filter(([key, value]) => 
          key && typeof key === 'string' && key.trim() && value !== null && key !== "null" && value > 0
        );
        if (!validResourceEntries.length) return null;
        
        return (
          <div key={islandId} style={{ marginBottom: '10px' }}>
            <p style={{ fontWeight: 'bold' }}>Owner: {islandOwnership[islandId] || "Unowned"}</p>
            {validResourceEntries.map(([resourceType, amount]) => (
              <div key={resourceType} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ margin: '4px 0' }}>{resourceType}: {amount > 0 ? amount : "Depleted"}</p>
              </div>
            ))}
          </div>
        );
      })}

    </div>
  );
};

export default ResourcePopup;
