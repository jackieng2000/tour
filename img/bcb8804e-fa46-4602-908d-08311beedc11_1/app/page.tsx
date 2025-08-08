
'use client';

import { useEffect, useState } from 'react';

interface Snowflake {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
}

export default function Home() {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    const createSnowflake = (id: number): Snowflake => ({
      id,
      x: Math.random() * window.innerWidth,
      y: -10,
      size: Math.random() * 3 + 2,
      speed: Math.random() * 2 + 1,
      opacity: Math.random() * 0.6 + 0.4,
    });

    const initialSnowflakes = Array.from({ length: 50 }, (_, i) => 
      createSnowflake(i)
    );
    setSnowflakes(initialSnowflakes);

    const interval = setInterval(() => {
      setSnowflakes(prev => prev.map(snowflake => {
        const newY = snowflake.y + snowflake.speed;
        if (newY > window.innerHeight) {
          return createSnowflake(snowflake.id);
        }
        return { ...snowflake, y: newY };
      }));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Snow Animation */}
      {snowflakes.map((snowflake) => (
        <div
          key={snowflake.id}
          className="absolute rounded-full bg-white pointer-events-none"
          style={{
            left: `${snowflake.x}px`,
            top: `${snowflake.y}px`,
            width: `${snowflake.size}px`,
            height: `${snowflake.size}px`,
            opacity: snowflake.opacity,
          }}
        />
      ))}

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-white px-4">
        <div className="text-center max-w-4xl">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Winter Wonderland
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Experience the magic of falling snow
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white hover:bg-white/30 transition-all duration-300 whitespace-nowrap cursor-pointer">
              Explore Winter
            </button>
            <button className="px-8 py-4 bg-blue-600/80 backdrop-blur-sm border border-blue-500/50 rounded-full text-white hover:bg-blue-600/90 transition-all duration-300 whitespace-nowrap cursor-pointer">
              Learn More
            </button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-6xl w-full">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-blue-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-snowflake-line text-2xl text-blue-200"></i>
            </div>
            <h3 className="text-xl font-semibold mb-3">Snow Magic</h3>
            <p className="text-blue-100">Watch beautiful snowflakes dance across your screen in real-time animation</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-purple-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-cloud-snow-line text-2xl text-purple-200"></i>
            </div>
            <h3 className="text-xl font-semibold mb-3">Winter Atmosphere</h3>
            <p className="text-blue-100">Immerse yourself in a peaceful winter night with gentle falling snow</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-indigo-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-star-line text-2xl text-indigo-200"></i>
            </div>
            <h3 className="text-xl font-semibold mb-3">Mesmerizing Beauty</h3>
            <p className="text-blue-100">Experience the calming effect of nature's winter wonderland</p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 w-full max-w-4xl">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">50+</div>
            <div className="text-blue-200">Snowflakes</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">∞</div>
            <div className="text-blue-200">Magic Moments</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">24/7</div>
            <div className="text-blue-200">Snow Fall</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">100%</div>
            <div className="text-blue-200">Wonder</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 text-blue-200">
        <p>&copy; 2024 Winter Wonderland. Made with snow and magic.</p>
      </footer>
    </div>
  );
}
