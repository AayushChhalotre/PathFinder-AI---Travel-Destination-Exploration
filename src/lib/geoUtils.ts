/**
 * Calculates the distance between two points on the Earth's surface using the Haversine formula.
 * @param lat1 Latitude of the first point
 * @param lng1 Longitude of the first point
 * @param lat2 Latitude of the second point
 * @param lng2 Longitude of the second point
 * @returns Distance in kilometers
 */
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Estimates the travel time between two points based on distance and average speed.
 * @param distance Distance in kilometers
 * @param transportType Type of transport ('flight', 'train', 'car')
 * @returns Estimated travel time in hours
 */
export function estimateTravelTime(distance: number, transportType: 'flight' | 'train' | 'car'): number {
  let averageSpeed: number; // in km/h

  switch (transportType) {
    case 'flight':
      averageSpeed = 800; // Average commercial flight speed
      // Add some overhead for takeoff, landing, and airport procedures
      return distance / averageSpeed + 2;
    case 'train':
      averageSpeed = 80; // Average train speed including stops
      return distance / averageSpeed;
    case 'car':
      averageSpeed = 60; // Average car speed including stops and traffic
      return distance / averageSpeed;
    default:
      averageSpeed = 60;
      return distance / averageSpeed;
  }
}

/**
 * Formats the travel time into a human-readable string.
 * @param hours Travel time in hours
 * @returns Formatted string (e.g., "2h 30m")
 */
export function formatTravelTime(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}
