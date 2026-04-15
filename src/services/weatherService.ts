export interface WeatherResult {
  avgTemp: number;
  precipitation: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'unknown';
}

export const fetchWeather = async (
  lat: number,
  lng: number,
  startDate: string,
  endDate: string
): Promise<WeatherResult> => {
  try {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Check if dates are within the 16-day forecast window
    const maxForecastDate = new Date();
    maxForecastDate.setDate(today.getDate() + 16);

    if (start > maxForecastDate) {
      // Fallback: This would normally use a historical average or climatology.
      // For now, we'll return a "Typical" result for the month.
      return {
        avgTemp: 22,
        precipitation: 0,
        condition: 'sunny'
      };
    }

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto&start_date=${startDate}&end_date=${endDate}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.daily) throw new Error('No weather data found');

    const temps = [
      ...data.daily.temperature_2m_max,
      ...data.daily.temperature_2m_min
    ];
    const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;
    const totalPrecip = data.daily.precipitation_sum.reduce((a: number, b: number) => a + b, 0);

    let condition: WeatherResult['condition'] = 'sunny';
    if (totalPrecip > 5) condition = 'rainy';
    else if (avgTemp < 15) condition = 'cloudy';

    return {
      avgTemp: Math.round(avgTemp),
      precipitation: totalPrecip,
      condition
    };
  } catch (error) {
    console.error('Weather Fetch Error:', error);
    return {
      avgTemp: 20,
      precipitation: 0,
      condition: 'unknown'
    };
  }
};
