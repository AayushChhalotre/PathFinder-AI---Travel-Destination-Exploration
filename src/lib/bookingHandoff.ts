export function getSkyscannerUrl(origin: string | null, destination: string, dateStart: string | null, dateEnd: string | null) {
  const from = origin ? encodeURIComponent(origin) : 'anywhere';
  const to = encodeURIComponent(destination);
  
  // Skyscanner format typically uses YYYY-MM-DD for simple searches via URL params or their deep link structure.
  // For MVP, we'll use a generic search structure that redirects.
  const start = dateStart ? new Date(dateStart).toISOString().split('T')[0] : ''; 
  const end = dateEnd ? new Date(dateEnd).toISOString().split('T')[0] : '';
  
  const dateStr = start ? (end ? `/${start}/${end}` : `/${start}`) : '';
  
  return `https://www.skyscanner.com/transport/flights/${from}/${to}${dateStr}`;
}

export function getBookingComUrl(destination: string, dateStart: string | null, dateEnd: string | null, numTravellers: number | null) {
  const dest = encodeURIComponent(destination);
  const checkin = dateStart ? new Date(dateStart).toISOString().split('T')[0] : '';
  const checkout = dateEnd ? new Date(dateEnd).toISOString().split('T')[0] : '';
  const guests = numTravellers || 2;

  let url = `https://www.booking.com/searchresults.html?ss=${dest}`;
  if (checkin) url += `&checkin=${checkin}`;
  if (checkout) url += `&checkout=${checkout}`;
  url += `&group_adults=${guests}`;
  
  return url;
}
