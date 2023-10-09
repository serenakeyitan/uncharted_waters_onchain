import React from 'react';
import './inventory.css';

const getResourceColor = (resource) => {
    switch (resource) {
        case 'Wood': return '#8B4513'; // Brown for Wood
        case 'Stone': return '#808080'; // Gray for Stone
        case 'Cotton': return '#FFD700'; // Gold for Cotton
        case 'Iron': return '#D3D3D3'; // Light Gray for Iron
        case 'Coal': return '#000000'; // Black for Coal
        case 'Copper': return '#FFA500'; // Copper for Copper
        case 'Uranium': return '#00FF00'; // Green for Uranium
        default: return 'brown'; // Default color
    }
}

const PlayerInventory = ({ inventory }) => {
    console.log('Rendering PlayerInventory with inventory:', inventory);
    return (
      <div className="inventory-grid">
        {Object.keys(inventory).map(resource => (
          <div className="slot" data-resource={resource} key={resource}>
            <span className="resource-name">{resource}</span>
            <span className="slot-count">{inventory[resource]}</span>
          </div>
        ))}
      </div>
    );
};


export default PlayerInventory;
