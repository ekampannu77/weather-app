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
}

type ParticleType = 'rain' | 'snow' | 'lightning' | 'sun' | 'cloud' | 'fog' | null;

interface SceneConfig {
  gradient: string;
  particleType: ParticleType;
  count: number;
  hasLightning?: boolean;
  rainAngle?: number;
}

function getScene(id?: number): SceneConfig {
  // Default — no weather searched yet
  if (!id) return {
    gradient: 'from-sky-200 via-blue-100 to-indigo-100 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900',
    particleType: null,
    count: 0,
  };

  // Thunderstorm 200–232
  if (id >= 200 && id < 300) return {
    gradient: 'from-gray-900 via-slate-800 to-gray-950 dark:from-black dark:via-slate-900 dark:to-gray-950',
    particleType: 'lightning',
    count: 130,
    hasLightning: true,
    rainAngle: -15,
  };

  // Drizzle 300–321
  if (id >= 300 && id < 400) return {
    gradient: 'from-slate-500 via-blue-500 to-slate-600 dark:from-slate-700 dark:via-blue-700 dark:to-slate-800',
    particleType: 'rain',
    count: 55,
    rainAngle: -8,
  };

  // Rain 500–531
  if (id >= 500 && id < 600) return {
    gradient: 'from-slate-700 via-gray-600 to-slate-800 dark:from-slate-900 dark:via-gray-800 dark:to-slate-900',
    particleType: 'rain',
    count: id >= 502 ? 140 : 95,
    rainAngle: -12,
  };

  // Snow 600–622
  if (id >= 600 && id < 700) return {
    gradient: 'from-slate-200 via-blue-100 to-white dark:from-slate-700 dark:via-blue-900 dark:to-slate-800',
    particleType: 'snow',
    count: id === 601 || id >= 611 ? 85 : 60,
  };

  // Atmosphere 700–781 (mist, smoke, haze, fog, dust, sand…)
  if (id >= 700 && id < 800) return {
    gradient: 'from-gray-500 via-gray-400 to-slate-500 dark:from-gray-800 dark:via-gray-700 dark:to-slate-800',
    particleType: 'fog',
    count: 8,
  };

  // Clear sky 800
  if (id === 800) return {
    gradient: 'from-sky-400 via-blue-500 to-indigo-600 dark:from-sky-700 dark:via-blue-800 dark:to-indigo-900',
    particleType: 'sun',
    count: 18,
  };

  // Few / scattered clouds 801–802
  if (id <= 802) return {
    gradient: 'from-sky-200 via-blue-300 to-sky-300 dark:from-sky-800 dark:via-blue-700 dark:to-sky-900',
    particleType: 'cloud',
    count: id === 801 ? 4 : 6,
  };

  // Broken / overcast 803–804
  return {
    gradient: 'from-gray-400 via-slate-500 to-gray-500 dark:from-gray-700 dark:via-slate-700 dark:to-gray-800',
    particleType: 'cloud',
    count: 9,
  };
}

export default function WeatherBackground({ weatherId }: Props) {
  const scene = useMemo(() => getScene(weatherId), [weatherId]);

  const particles = useMemo<Particle[]>(() => {
    if (!scene.particleType || !scene.count) return [];
    let s = (weatherId ?? 42) * 9301 + 49297;
    const r = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    return Array.from({ length: scene.count }, (_, i) => ({
      id: i,
      left: r() * 105 - 2,
      delay: r() * 5,
      duration: 0.4 + r() * 1.2,
      size: 1.5 + r() * 3.5,
      opacity: 0.45 + r() * 0.4,
    }));
  }, [scene.particleType, scene.count, weatherId]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">

      {/* ── Gradient base ── */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${scene.gradient} transition-all duration-[1500ms]`}
      />

      {/* ── Rain / Thunderstorm ──
           Container is rotated to make drops fall diagonally.
           Each drop just animates translateY so there's no transform conflict. */}
      {(scene.particleType === 'rain' || scene.particleType === 'lightning') && (
        <div
          className="absolute inset-0"
          style={{
            transform: `rotate(${scene.rainAngle ?? -12}deg)`,
            transformOrigin: 'top center',
            width: '130%',
            left: '-15%',
          }}
        >
          {particles.map(p => (
            <div
              key={p.id}
              className="absolute top-0"
              style={{
                left: `${p.left}%`,
                width: `${Math.max(1, p.size * 0.28)}px`,
                height: `${p.size * 20}px`,
                opacity: p.opacity,
                borderRadius: '0 0 3px 3px',
                background: 'linear-gradient(to bottom, rgba(186,230,253,0.95), rgba(147,197,253,0.2))',
                animation: `rain-fall ${p.duration * 0.6}s linear ${p.delay}s infinite`,
              }}
            />
          ))}
        </div>
      )}

      {/* ── Lightning flash ── */}
      {scene.hasLightning && (
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 40% 0%, rgba(255,255,220,0.95) 0%, rgba(255,255,180,0.4) 25%, transparent 55%)',
            animation: 'lightning-flash 4.2s ease-in-out 0.6s infinite',
          }}
        />
      )}

      {/* ── Snowflakes ── */}
      {scene.particleType === 'snow' && particles.map(p => (
        <div
          key={p.id}
          className="absolute top-0 rounded-full bg-white"
          style={{
            left: `${p.left}%`,
            width: `${p.size + 3}px`,
            height: `${p.size + 3}px`,
            opacity: p.opacity + 0.15,
            boxShadow: `0 0 ${p.size + 3}px rgba(255,255,255,0.9), 0 0 ${p.size}px rgba(200,220,255,0.6)`,
            animation: `snow-drift ${p.duration * 5 + 5}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}

      {/* ── Sun burst ── */}
      {scene.particleType === 'sun' && (
        <div
          className="absolute"
          style={{ top: '-70px', left: '50%', transform: 'translateX(-50%)' }}
        >
          {/* Glowing core */}
          <div
            style={{
              width: '260px',
              height: '260px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(253,224,71,1) 0%, rgba(251,191,36,0.65) 30%, rgba(253,230,138,0.2) 60%, transparent 75%)',
              animation: 'sun-glow 3.5s ease-in-out infinite',
            }}
          />
          {/* Rotating rays */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '520px',
              height: '520px',
              marginTop: '-260px',
              marginLeft: '-260px',
              animation: 'sun-spin 28s linear infinite',
            }}
          >
            {particles.map((p, i) => (
              <div
                key={p.id}
                style={{
                  position: 'absolute',
                  bottom: '50%',
                  left: '50%',
                  width: '2px',
                  height: `${80 + p.size * 30}px`,
                  marginLeft: '-1px',
                  transformOrigin: 'bottom center',
                  transform: `rotate(${(i / particles.length) * 360}deg)`,
                  background: 'linear-gradient(to top, rgba(253,224,71,0.6), transparent)',
                  opacity: p.opacity,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Clouds ── */}
      {scene.particleType === 'cloud' && particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full blur-2xl"
          style={{
            left: `${p.left - 5}%`,
            top: `${(p.id / particles.length) * 42}%`,
            width: `${290 + p.size * 115}px`,
            height: `${78 + p.size * 34}px`,
            background: 'rgba(255,255,255,0.52)',
            animation: `cloud-drift ${11 + p.delay * 3}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}

      {/* ── Fog ── */}
      {scene.particleType === 'fog' && particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full blur-3xl"
          style={{
            left: `${p.left - 15}%`,
            top: `${8 + (p.id / particles.length) * 72}%`,
            width: `${390 + p.size * 130}px`,
            height: `${88 + p.size * 28}px`,
            background: 'rgba(209,213,219,0.6)',
            animation: `fog-slide ${15 + p.delay * 4}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}

    </div>
  );
}
