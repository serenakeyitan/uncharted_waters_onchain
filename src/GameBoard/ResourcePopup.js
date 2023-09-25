import React from 'react';

const ResourcePopup = ({ hoveredIsland, popupPosition, islandOwnership }) => {
  console.log('hoveredIsland:', hoveredIsland); // Debugging
  console.log('islandOwnership:', islandOwnership); // Debugging

  return (
    hoveredIsland && popupPosition && (
      <div style={{
        position: 'fixed',
        left: `${popupPosition.x}px`,
        top: `${popupPosition.y}px`,
        backgroundColor: 'rgba(0, 0, 0, 0.8)', // Dark semi-transparent background
        color: '#fff', // White text color
        fontFamily: 'serif', // Serif font family
        border: '2px solid #333', // Dark border
        zIndex: 1000,
        padding: '10px', // Padding for content
        borderRadius: '5px', // Rounded corners
        maxWidth: '300px', // Limit width
      }}>
        {/* Render ownership for the hovered island */}
        {hoveredIsland && Object.keys(hoveredIsland).map((islandId) => {
          const islandResource = hoveredIsland[islandId];
          const owner = islandOwnership ? (islandOwnership[islandId] || "Unowned") : "Unowned"; // Added check
          return (
            <div key={islandId} style={{ marginBottom: '10px' }}>
              <p style={{ fontWeight: 'bold' }}>Owner: {owner}</p>
              {owner === "You" && <p>You can withdraw your stake.</p>} {/* Show message if user owns it */}
              {Object.keys(islandResource).map((resource) => (
                <p key={resource} style={{ margin: '4px 0' }}>
                  {resource}: {islandResource[resource]}
                </p>
              ))}
            </div>
          );
        })}
      </div>
    )
  );
};

export default ResourcePopup;
