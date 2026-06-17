"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface Planet {
  name: string;
  nameEn: string;
  diameter: number;
  distance: number;
  orbitalPeriod: number;
  moons: number;
  temperature: string;
  color: string;
  size: number;
  orbitRadius: number;
}

const PLANETS: Planet[] = [
  { name: "水星", nameEn: "Mercury", diameter: 4879, distance: 57.9, orbitalPeriod: 88, moons: 0, temperature: "-180°C ~ 430°C", color: "#b5b5b5", size: 8, orbitRadius: 65 },
  { name: "金星", nameEn: "Venus", diameter: 12104, distance: 108.2, orbitalPeriod: 225, moons: 0, temperature: "462°C（平均）", color: "#e8cda0", size: 12, orbitRadius: 95 },
  { name: "地球", nameEn: "Earth", diameter: 12742, distance: 149.6, orbitalPeriod: 365, moons: 1, temperature: "15°C（平均）", color: "#4a90d9", size: 13, orbitRadius: 130 },
  { name: "火星", nameEn: "Mars", diameter: 6779, distance: 227.9, orbitalPeriod: 687, moons: 2, temperature: "-65°C（平均）", color: "#c1440e", size: 10, orbitRadius: 170 },
  { name: "木星", nameEn: "Jupiter", diameter: 139820, distance: 778.5, orbitalPeriod: 4333, moons: 95, temperature: "-110°C（云层）", color: "#c88b3a", size: 28, orbitRadius: 220 },
  { name: "土星", nameEn: "Saturn", diameter: 116460, distance: 1434, orbitalPeriod: 10759, moons: 146, temperature: "-140°C（云层）", color: "#e8d5a3", size: 24, orbitRadius: 280 },
  { name: "天王星", nameEn: "Uranus", diameter: 50724, distance: 2871, orbitalPeriod: 30687, moons: 27, temperature: "-195°C（云层）", color: "#72b5c4", size: 18, orbitRadius: 335 },
  { name: "海王星", nameEn: "Neptune", diameter: 49244, distance: 4495, orbitalPeriod: 60190, moons: 16, temperature: "-200°C（云层）", color: "#3b5bdb", size: 17, orbitRadius: 380 },
];

function lightenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, ((num >> 8) & 0x00ff) + amt);
  const B = Math.min(255, (num & 0x0000ff) + amt);
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
}

function darkenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, (num >> 16) - amt);
  const G = Math.max(0, ((num >> 8) & 0x00ff) - amt);
  const B = Math.max(0, (num & 0x0000ff) - amt);
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
}

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  brightness: number;
  twinkle: number;
}

export function SolarSystem() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ropeRef = useRef<HTMLDivElement>(null);
  const [solarVisible, setSolarVisible] = useState(false);
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [pullProgress, setPullProgress] = useState(0);

  const starsRef = useRef<Star[]>([]);
  const planetAnglesRef = useRef(PLANETS.map(() => Math.random() * Math.PI * 2));
  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);
  const solarVisibleRef = useRef(false);
  const rafStarRef = useRef<number>(0);
  const rafOrbitRef = useRef<number>(0);
  const lastTimeRef = useRef(0);

  useEffect(() => { solarVisibleRef.current = solarVisible; }, [solarVisible]);

  const initStars = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.width;
    const h = canvas.height;
    const count = Math.floor((w * h) / 4000);
    starsRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 2 + 0.5,
      speed: Math.random() * 0.5 + 0.1,
      brightness: Math.random(),
      twinkle: Math.random() * 0.02 + 0.01,
    }));
  }, []);

  const drawStars = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, w, h);

    for (const star of starsRef.current) {
      star.brightness += star.twinkle;
      if (star.brightness > 1 || star.brightness < 0.3) star.twinkle = -star.twinkle;
      const alpha = Math.max(0.2, Math.min(1, star.brightness));
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fill();
      star.y += star.speed;
      if (star.y > h) { star.y = 0; star.x = Math.random() * w; }
    }
    rafStarRef.current = requestAnimationFrame(drawStars);
  }, []);

  const animateOrbits = useCallback((timestamp: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const dt = (timestamp - lastTimeRef.current) / 1000;
    lastTimeRef.current = timestamp;

    const planets = document.querySelectorAll<HTMLElement>("[data-planet-index]");
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const scale = Math.min(window.innerWidth, window.innerHeight) / 850;

    planets.forEach((el) => {
      const i = parseInt(el.dataset.planetIndex || "0");
      const planet = PLANETS[i];
      const speed = (365 / planet.orbitalPeriod) * 0.5;
      planetAnglesRef.current[i] += speed * dt;
      const r = planet.orbitRadius * scale;
      const x = cx + Math.cos(planetAnglesRef.current[i]) * r - planet.size / 2;
      const y = cy + Math.sin(planetAnglesRef.current[i]) * r - planet.size / 2;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });

    rafOrbitRef.current = requestAnimationFrame(animateOrbits);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [initStars]);

  useEffect(() => {
    rafStarRef.current = requestAnimationFrame(drawStars);
    return () => cancelAnimationFrame(rafStarRef.current);
  }, [drawStars]);

  useEffect(() => {
    if (solarVisible) {
      lastTimeRef.current = 0;
      rafOrbitRef.current = requestAnimationFrame(animateOrbits);
    } else {
      cancelAnimationFrame(rafOrbitRef.current);
    }
    return () => cancelAnimationFrame(rafOrbitRef.current);
  }, [solarVisible, animateOrbits]);

  const getClientY = (e: React.MouseEvent | React.TouchEvent) =>
    "touches" in e ? e.touches[0].clientY : e.clientY;

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (solarVisible) return;
    isDraggingRef.current = true;
    startYRef.current = getClientY(e);
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    const diff = getClientY(e) - startYRef.current;
    const maxPull = window.innerHeight * 0.4;
    const progress = Math.max(0, Math.min(1, diff / maxPull));
    setPullProgress(progress);
  };

  const handleEnd = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const threshold = window.innerHeight * 0.3;
    const diff = pullProgress * window.innerHeight * 0.4;
    if (diff > threshold) {
      setSolarVisible(true);
    }
    setPullProgress(0);
  };

  const handleRopeKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setSolarVisible((v) => !v);
    }
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedPlanet(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const ropeHeight = 80 + pullProgress * 120;

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0"
        aria-hidden="true"
      />

      {!solarVisible && (
        <div
          ref={ropeRef}
          className="fixed top-0 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center cursor-grab select-none touch-none"
          style={{ cursor: isDraggingRef.current ? "grabbing" : "grab" }}
          onMouseDown={handleStart}
          onTouchStart={handleStart}
          onMouseMove={handleMove}
          onTouchMove={handleMove}
          onMouseUp={handleEnd}
          onTouchEnd={handleEnd}
          onMouseLeave={handleEnd}
          onKeyDown={handleRopeKeyDown}
          role="slider"
          aria-label="下拉显示太阳系"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pullProgress * 100)}
          tabIndex={0}
        >
          <div
            className="w-10 h-[30px] rounded-b-[20px] relative"
            style={{
              background: "linear-gradient(180deg, #8b6914, #a67c00, #8b6914)",
              boxShadow: "0 4px 15px rgba(139,105,20,0.5)",
            }}
          >
            <span className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 text-sm text-white/40 animate-bounce">
              ⬇
            </span>
          </div>
          <div
            className="w-1.5 rounded-b-[3px]"
            style={{
              height: `${ropeHeight - 30}px`,
              background: "linear-gradient(90deg, #6b5a14, #a67c00, #6b5a14)",
            }}
          />
        </div>
      )}

      {solarVisible && (
        <button
          className="fixed top-4 right-4 z-[150] bg-purple-500/20 border border-purple-500/40 text-white/70 px-4 py-2 rounded-full text-sm backdrop-blur-md hover:bg-purple-500/40 transition-colors"
          onClick={() => { setSolarVisible(false); setSelectedPlanet(null); }}
          aria-label="收起太阳系"
        >
          ✕ 收起
        </button>
      )}

      <div
        className="fixed inset-0 z-50 transition-all duration-500 ease-out"
        style={{
          opacity: solarVisible ? 1 : 0,
          transform: solarVisible ? "translateY(0)" : "translateY(-100%)",
          pointerEvents: solarVisible ? "auto" : "none",
        }}
        role="region"
        aria-label="太阳系交互模型"
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full z-10"
          style={{
            background: "radial-gradient(circle at 35% 35%, #fff7ad, #ffa500, #ff4500)",
            boxShadow: "0 0 40px rgba(255,165,0,0.8), 0 0 80px rgba(255,69,0,0.5), 0 0 120px rgba(255,165,0,0.3)",
            animation: "sunGlow 3s ease-in-out infinite",
          }}
        />

        {PLANETS.map((planet) => {
          const scale = typeof window !== "undefined"
            ? Math.min(window.innerWidth, window.innerHeight) / 850
            : 0.5;
          const r = planet.orbitRadius * scale;
          return (
            <div
              key={`orbit-${planet.nameEn}`}
              className="absolute top-1/2 left-1/2 rounded-full border border-white/[0.08] pointer-events-none"
              style={{ width: r * 2, height: r * 2, marginLeft: -r, marginTop: -r }}
            />
          );
        })}

        {PLANETS.map((planet, i) => (
          <button
            key={planet.nameEn}
            data-planet-index={i}
            className="absolute top-0 left-0 rounded-full cursor-pointer z-5 will-change-transform hover:z-20 hover:brightness-125 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
            style={{
              width: planet.size,
              height: planet.size,
              background: `radial-gradient(circle at 35% 35%, ${lightenColor(planet.color, 40)}, ${planet.color}, ${darkenColor(planet.color, 40)})`,
              boxShadow: `0 0 ${planet.size / 2}px ${planet.color}66, inset -${planet.size / 6}px -${planet.size / 6}px ${planet.size / 3}px rgba(0,0,0,0.4)`,
            }}
            onClick={() => setSelectedPlanet(planet)}
            aria-label={`${planet.name} - 点击查看参数`}
            tabIndex={0}
          >
            {planet.nameEn === "Saturn" && (
              <div
                className="absolute rounded-full border-2 pointer-events-none"
                style={{
                  width: planet.size * 1.8,
                  height: planet.size * 0.5,
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  borderColor: "rgba(232,213,163,0.4)",
                }}
              />
            )}
          </button>
        ))}
      </div>

      <div
        className={`fixed z-[200] transition-transform duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          selectedPlanet
            ? "translate-y-0 md:translate-x-0"
            : "translate-y-full md:translate-x-[120%] md:translate-y-0"
        } top-auto bottom-0 left-0 right-0 w-full md:top-1/2 md:bottom-auto md:right-10 md:left-auto md:w-[300px] md:-translate-y-1/2`}
        style={{
          background: "rgba(10,5,30,0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(107,78,230,0.4)",
          borderRadius: "16px 16px 0 0",
          padding: "28px",
          boxShadow: "0 0 40px rgba(107,78,230,0.2)",
        }}
        role="dialog"
        aria-label="行星参数"
        aria-hidden={!selectedPlanet}
      >
        {selectedPlanet && (
          <>
            <button
              className="absolute top-3 right-4 text-white/50 text-2xl hover:text-white transition-colors bg-transparent border-none cursor-pointer"
              onClick={() => setSelectedPlanet(null)}
              aria-label="关闭面板"
            >
              &times;
            </button>
            <div
              className="w-[60px] h-[60px] rounded-full mb-4"
              style={{
                background: `radial-gradient(circle at 35% 35%, ${lightenColor(selectedPlanet.color, 40)}, ${selectedPlanet.color})`,
                boxShadow: `0 0 20px ${selectedPlanet.color}66`,
              }}
            />
            <div
              className="text-2xl font-light tracking-wider mb-5"
              style={{
                background: "linear-gradient(90deg, #a78bfa, #c084fc)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {selectedPlanet.name} {selectedPlanet.nameEn}
            </div>
            {[
              { label: "直径", value: `${selectedPlanet.diameter.toLocaleString()} km` },
              { label: "距太阳", value: `${selectedPlanet.distance.toLocaleString()} 百万km` },
              { label: "公转周期", value: `${selectedPlanet.orbitalPeriod.toLocaleString()} 天` },
              { label: "卫星数", value: String(selectedPlanet.moons) },
              { label: "表面温度", value: selectedPlanet.temperature },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex justify-between items-center py-2.5 border-b border-white/[0.06] last:border-b-0"
              >
                <span className="text-sm text-white/50">{label}</span>
                <span className="text-[0.95rem] text-white/90 font-medium">{value}</span>
              </div>
            ))}
          </>
        )}
      </div>

      {selectedPlanet && solarVisible && (
        <div
          className="fixed inset-0 z-[150]"
          onClick={() => setSelectedPlanet(null)}
          aria-hidden="true"
        />
      )}

      <style jsx global>{`
        @keyframes sunGlow {
          0%, 100% { box-shadow: 0 0 40px rgba(255,165,0,0.8), 0 0 80px rgba(255,69,0,0.5); }
          50% { box-shadow: 0 0 60px rgba(255,165,0,1), 0 0 100px rgba(255,69,0,0.7); }
        }
      `}</style>
    </>
  );
}
