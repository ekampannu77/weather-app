'use client';

import { useMemo } from 'react';

interface Props {
  weatherId?: number;
}

interface Particle {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  opacity: number;
  top: number;
}

type ParticleType = 'rain' | 'snow' | 'lightning' | 'sun' | 'cloud' | 'fog' | null;

interface SceneConfig {
  gradient: string;
  particleType: ParticleType;
  particleCount: number;
}

function getScene(id?: number): SceneConfig {
  if (!id) return { gradient: '', particleType: null, particleCount: 0 };

  if (id >= 200 && id < 300) return {
    gradient: 'from-slate-700 via-gray-800 to-slate-900',
    particleType: 'lightning',
    particleCount: 55,
  };
  if (id >= 300 && id < 400) return {
    gradient: 'from-slate-400 via-blue-600 to-gray-700',
    particleType: 'rain',
    particleCount: 40,
  };
  if (id >= 500 && id < 600) return {
    gradient: 'from-slate-600 via-gray-700 to-slate-800',
    particleType: 'rain',
    particleCount: 75,
  };
  if (id >= 600 && id < 700) return {
    gradient: 'from-sky-100 via-blue-100 to-indigo-200',
    particleType: 'snow',
    particleCount: 45,
  };
  if (id >= 700 && id < 800) return {
    gradient: 'from-gray-400 via-gray-300 to-slate-400',
    particleType: 'fog',
    particleCount: 6,
  };
  if (id === 800) return {
    gradient: 'from-sky-300 via-blue-400 to-indigo-500',
    particleType: 'sun',
    particleCount: 12,
  };
  if (id === 801 || id === 802) return {
    gradient: 'from-sky-200 via-blue-300 to-indigo-400',
    particleType: 'cloud',
    particleCount: 5,
  };
  // 803–804 overcast
  return {
    gradient: 'from-gray-300 via-slate-400 to-gray-500',
    particleType: 'cloud',
    particleCount: 7,
  };
}

export default function WeatherBackground({ weatherId }: Props) {
  const scene = useMemo(() => getScene(weatherId), [weatherId]);

  const particles = useMemo<Particle[]>(() => {
    if (!scene.particleType || scene.particleCount === 0) return [];
    // Use a simple LCG so values are stable between renders (no hydration mismatch)
    let seed = (weatherId ?? 0) * 9301 + 49297;
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    return Array.from({ length: scene.particleCount }, (_, i) => ({
      id: i,
      left:     rand() * 100,
      top:      rand() * 100,
      delay:    rand() * 6,
      duration: 0.6 + rand() * 1.8,
      size:     1 + rand() * 3,
      opacity:  0.15 + rand() * 0.3,
    }));
  }, [scene.particleType, scene.particleCount, weatherId]);

  if (!weatherId || !scene.particleType) return null;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Gradient base */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${scene.gradient} opacity-20 dark:opacity-10 transition-all duration-1000`}
      />

      {/* Rain drops (rain + thunderstorm) */}
      {(scene.particleType === 'rain' || scene.particleType === 'lightning') &&
        particles.map(p => (
          <div
            key={p.id}
            className="absolute top-0 bg-blue-300 dark:bg-blue-400 rounded-full"
            style={{
              left:      `${p.left}%`,
              width:     `${Math.max(1, p.size * 0.4)}px`,
              height:    `${p.size * 14}px`,
              opacity:   p.opacity,
              animation: `rain-fall ${p.duration}s linear ${p.delay}s infinite`,
            }}
          />
        ))
      }

      {/* Lightning flash overlay */}
      {scene.particleType === 'lightning' && (
        <div
          className="absolute inset-0 bg-yellow-100 dark:bg-yellow-200"
          style={{ animation: 'lightning-flash 4.5s ease-in-out infinite' }}
        />
      )}

      {/* Snowflakes */}
      {scene.particleType === 'snow' &&
        particles.map(p => (
          <div
            key={p.id}
            className="absolute top-0 bg-white rounded-full shadow-sm"
            style={{
              left:      `${p.left}%`,
              width:     `${p.size + 2}px`,
              height:    `${p.size + 2}px`,
              opacity:   p.opacity + 0.3,
              animation: `snow-drift ${p.duration * 4 + 4}s ease-in-out ${p.delay}s infinite`,
            }}
          />
        ))
      }

      {/* Sun rays */}
      {scene.particleType === 'sun' && (
        <div className="absolute -top-16 left-1/2 -translate-x-1/2">
          {particles.map((p, i) => {
            const angle = (i / particles.length) * 360;
            return (
              <div
                key={p.id}
                className="absolute bottom-0 left-0 origin-bottom bg-yellow-200 dark:bg-yellow-300"
                style={{
                  width:     '3px',
                  height:    `${90 + p.size * 22}px`,
                  opacity:   p.opacity,
                  transform: `rotate(${angle}deg)`,
                  animation: `sun-pulse ${2.5 + p.delay * 0.4}s ease-in-out ${p.delay * 0.3}s infinite`,
                }}
              />
            );
          })}
        </div>
      )}

      {/* Clouds */}
      {scene.particleType === 'cloud' &&
        particles.map(p => (
          <div
            key={p.id}
            className="absolute bg-white dark:bg-gray-400 rounded-full blur-3xl"
            style={{
              left:      `${p.left - 5}%`,
              top:       `${p.top * 0.4}%`,
              width:     `${220 + p.size * 90}px`,
              height:    `${65 + p.size * 28}px`,
              opacity:   p.opacity,
              animation: `cloud-bob ${9 + p.delay * 2}s ease-in-out ${p.delay}s infinite`,
            }}
          />
        ))
      }

      {/* Fog */}
      {scene.particleType === 'fog' &&
        particles.map(p => (
          <div
            key={p.id}
            className="absolute bg-gray-300 dark:bg-gray-600 rounded-full blur-3xl"
            style={{
              left:      `${p.left - 10}%`,
              top:       `${15 + p.top * 0.6}%`,
              width:     `${300 + p.size * 100}px`,
              height:    `${80 + p.size * 20}px`,
              opacity:   0.35,
              animation: `fog-slide ${12 + p.delay * 3}s ease-in-out ${p.delay}s infinite`,
            }}
          />
        ))
      }
    </div>
  );
}
