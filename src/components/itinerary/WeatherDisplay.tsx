import React, { useState, useEffect } from 'react';
import { Sun, Cloud, Wind, CloudRain, CloudSnow, CloudLightning } from 'lucide-react';

export function WeatherDisplay({ lat, lng }: { lat?: number; lng?: number }) {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!lat || !lng) return;

    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`
        );
        const data = await response.json();
        setWeather(data);
      } catch (error) {
        console.error("Error fetching weather:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [lat, lng]);

  if (!lat || !lng) return null;
  if (loading) return (
    <div className="flex items-center gap-2 animate-pulse">
      <div className="w-8 h-8 bg-white/5 rounded-lg" />
      <div className="h-4 w-20 bg-white/5 rounded" />
    </div>
  );
  if (!weather) return null;

  const getWeatherIcon = (code: number) => {
    if (code === 0) return <Sun className="w-5 h-5 text-amber-400" />;
    if (code <= 3) return <Cloud className="w-5 h-5 text-zinc-200" />;
    if (code <= 48) return <Wind className="w-5 h-5 text-zinc-300" />;
    if (code <= 65 || (code >= 80 && code <= 82)) return <CloudRain className="w-5 h-5 text-blue-400" />;
    if (code <= 77) return <CloudSnow className="w-5 h-5 text-indigo-300" />;
    if (code >= 95) return <CloudLightning className="w-5 h-5 text-purple-400" />;
    return <Cloud className="w-5 h-5 text-zinc-200" />;
  };

  const current = weather.current_weather;
  const daily = weather.daily;

  return (
    <div className="flex flex-col gap-3 p-4 bg-white/5 rounded-2xl border border-white/10 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
            {getWeatherIcon(current.weathercode)}
          </div>
          <div>
            <p className="text-[8px] font-bold text-zinc-300 uppercase tracking-widest">Current Weather</p>
            <p className="text-lg font-display font-bold leading-none">{Math.round(current.temperature)}°C</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[8px] font-bold text-zinc-300 uppercase tracking-widest">Wind</p>
          <p className="text-xs font-medium">{current.windspeed} km/h</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1.5 pt-3 border-t border-white/5">
        {daily.time.slice(1, 4).map((date: string, i: number) => (
          <div key={date} className="flex flex-col items-center gap-0.5 p-1.5 rounded-lg bg-white/5 border border-white/5">
            <p className="text-[7px] font-bold text-zinc-300 uppercase">
              {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
            </p>
            <div className="scale-75">
              {getWeatherIcon(daily.weathercode[i + 1])}
            </div>
            <p className="text-[9px] font-bold">
              {Math.round(daily.temperature_2m_max[i + 1])}°/{Math.round(daily.temperature_2m_min[i + 1])}°
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
