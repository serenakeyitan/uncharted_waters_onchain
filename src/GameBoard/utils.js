export const distanceBetweenPoints = (x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };
  
  export const isFarEnough = (x, y, islandCenters) => {
    return islandCenters.every(([ix, iy]) => {
      return distanceBetweenPoints(x, y, ix, iy) >= 8;
    });
  };