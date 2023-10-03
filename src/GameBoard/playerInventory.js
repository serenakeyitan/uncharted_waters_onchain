import React from 'react';
import './inventory.css';

const resourceIcons = {
    Wood: "/color/wood.png",
    Stone: "/color/stone.png",
    Cotton: "/color/cotton.png",
    Iron: "/color/iron.png",
    Uranium: "/color/uranium.png",
    Copper_brown: "/color/copper_brown.png",
}

const PlayerInventory = ({ inventory }) => {
  return (
    <div className="inventory-grid">
      {Object.keys(inventory).map(resource => (
        <div className="slot" key={resource}>
          <img src={resourceIcons[resource]} alt={resource} />
          <span className="slot-count">{inventory[resource]}</span>
        </div>
      ))}
    </div>
  );
};

export default PlayerInventory;
