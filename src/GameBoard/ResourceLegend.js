import React, { useState } from 'react';
import './ResourceLegend.css';

const ResourceLegend = ({ resourceAmounts }) => {
  const [showTable, setShowTable] = useState(false);  // New state to manage table visibility
  
  const toggleTable = () => {
    setShowTable(!showTable);  // Toggle table visibility
  };
  
  // Check if resourceAmounts exists before using it
  if (!resourceAmounts) return null;

  const resourceColors = [
    { resource: 'Wood', color: '#8B4513' },    // Brown
    { resource: 'Stone', color: '#808080' },  // Gray
    { resource: 'Cotton', color: '#FFD700' }, // Gold
    { resource: 'Iron', color: '#D3D3D3' },   // Light Gray
    { resource: 'Coal', color: '#000000' },   // Black
    { resource: 'Copper', color: '#CD853F' }, // Copper (adjusted color)
    { resource: 'Uranium', color: '#00FF00' }, // Green
  ];


  // Merge amounts with color info
  const resourcesWithAmounts = resourceColors.map(colorInfo => ({
    ...colorInfo,
    amount: resourceAmounts[colorInfo.resource] || 0,
  }));

  return (
    <div>
      <button className="toggle-button" onClick={toggleTable}>
        Toggle Resource Table
      </button>
      {showTable && (  // Conditionally render the table based on showTable
        <div className="resource-table">
          <h2 style={{color: 'white'}}>Resource Legend</h2>
          <table>
            <thead>
              <tr>
                <th>Resource</th>
                <th>Color</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {resourcesWithAmounts.map((item, index) => (
                <tr key={index}>
                  <td>{item.resource}</td>
                  <td style={{ backgroundColor: item.color }}></td>
                  <td>{item.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ResourceLegend;