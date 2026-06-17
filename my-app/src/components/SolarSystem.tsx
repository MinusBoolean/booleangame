"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { EarthSystem } from "./EarthSystem";
import { GalaxyView } from "./GalaxyView";
import { PlanetPanel } from "./PlanetPanel";

type Layer = "earth" | "solar" | "galaxy";

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
  description?: string;
}

const PLANETS: Planet[] = [
  { name: "水星", nameEn: "Mercury", diameter: 4879, distance: 57.9, orbitalPeriod: 88, moons: 0, temperature: "-180°C ~ 430°C", color: "#b5b5b5", size: 8, orbitRadius: 65, description: "太阳系最小的行星，也是距太阳最近的行星。表面布满陨石坑。" },
  { name: "金星", nameEn: "Venus", diameter: 12104, distance: 108.2, orbitalPeriod: 225, moons: 0, temperature: "462°C（平均）", color: "#e8cda0", size: 12, orbitRadius: 95, description: "太阳系最热的行星，浓厚的大气层产生强烈的温室效应。" },
  { name: "地球", nameEn: "Earth", diameter: 12742, distance: 149.6, orbitalPeriod: 365, moons: 1, temperature: "15°C（平均）", color: "#4a90d9", size: 13, orbitRadius: 130, description: "人类的家园，太阳系中唯一已知存在生命的行星。" },
  { name: "火星", nameEn: "Mars", diameter: 6779, distance: 227.9, orbitalPeriod: 687, moons: 2, temperature: "-65°C（平均）", color: "#c1440e", size: 10, orbitRadius: 170, description: "红色星球，拥有太阳系最高的山——奥林匹斯山。" },
  { name: "木星", nameEn: "Jupiter", diameter: 139820, distance: 778.5, orbitalPeriod: 4333, moons: 95, temperature: "-110°C（云层）", color: "#c88b3a", size: 28, orbitRadius: 220, description: "太阳系最大的行星，著名的大红斑是持续数百年的风暴。" },
  { name: "土星", nameEn: "Saturn", diameter: 116460, distance: 1434, orbitalPeriod: 10759, moons: 146, temperature: "-140°C（云层）", color: "#e8d5a3", size: 24, orbitRadius: 280, description: "以壮观的环系统著称，是太阳系密度最低的行星。" },
  { name: "天王星", nameEn: "Uranus", diameter: 50724, distance: 2871, orbitalPeriod: 30687, moons: 27, temperature: "-195°C（云层）", color: "#72b5c4", size: 18, orbitRadius: 335, description: "冰巨星，自转轴几乎平行于公转轨道平面。" },
  { name: "海王星", nameEn: "Neptune", diameter: 49244, distance: 4495, orbitalPeriod: 60190, moons: 16, temperature: "-200°C（云层）", color: "#3b5bdb", size: 17, orbitRadius: 380, description: "太阳系最远的行星，拥有太阳系最快的风速。" },
];

const SUN: Planet = {
  name: "太阳", nameEn: "Sun", diameter: 1392700, distance: 0,
  orbitalPeriod: 0, moons: 0, temperature: "5500°C（表面）",
  color: "#ffa500", size: 80, orbitRadius: 0,
  description: "太阳系的中心恒星，占太阳系总质量的 99.86%。",
};

const LAYER_INFO: Record<Layer, { label: string; icon: string; description: string }> = {
  earth: { label: "地球系统", icon: "🌍", description: "地球与月球" },
  solar: { label: "太阳系", icon: "☀️", description: "八大行星" },
  galaxy: { label: "银河系", icon: "🌌", description: "星座与系外行星" },
};

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
  const [isVisible, setIsVisible] = useState(false);
  const [currentLayer, setCurrentLayer] = useState<Layer>("solar");
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [pullProgress, setPullProgress] = useState(0);
  const [timeSpeed, setTimeSpeed] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);

  const starsRef = useRef<Star[]>([]);
  const planetAnglesRef = useRef(PLANETS.map(() => Math.random() * Math.PI * 2));
  const rafStarRef = useRef<number>(0);
  const rafOrbitRef = useRef<number>(0);
  const lastTimeRef = useRef(0);
  const [orbitScale, setOrbitScale] = useState(0.5);

  useEffect(() => {
    setOrbitScale(Math.min(window.innerWidth, window.innerHeight) / 850);
    const handleResize = () => setOrbitScale(Math.min(window.innerWidth, window.innerHeight) / 850);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      const speed = (365 / planet.orbitalPeriod) * 0.5 * timeSpeed;
      planetAnglesRef.current[i] += speed * dt;
      const r = planet.orbitRadius * scale;
      const x = cx + Math.cos(planetAnglesRef.current[i]) * r - planet.size / 2;
      const y = cy + Math.sin(planetAnglesRef.current[i]) * r - planet.size / 2;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });

    rafOrbitRef.current = requestAnimationFrame(animateOrbits);
  }, [timeSpeed]);

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
    if (isVisible && currentLayer === "solar") {
      lastTimeRef.current = 0;
      rafOrbitRef.current = requestAnimationFrame(animateOrbits);
    } else {
      cancelAnimationFrame(rafOrbitRef.current);
    }
    return () => cancelAnimationFrame(rafOrbitRef.current);
  }, [isVisible, currentLayer, animateOrbits]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isVisible) return;
    e.preventDefault();
    startYRef.current = e.clientY;
    setIsDragging(true);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isVisible) return;
    startYRef.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const diff = e.clientY - startYRef.current;
      const maxPull = window.innerHeight * 0.4;
      const progress = Math.max(0, Math.min(1, diff / maxPull));
      setPullProgress(progress);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const diff = e.touches[0].clientY - startYRef.current;
      const maxPull = window.innerHeight * 0.4;
      const progress = Math.max(0, Math.min(1, diff / maxPull));
      setPullProgress(progress);
    };

    const handleEnd = () => {
      setIsDragging(false);
      setPullProgress((prev) => {
        const diff = prev * window.innerHeight * 0.4;
        if (diff > window.innerHeight * 0.3) {
          setIsVisible(true);
        }
        return 0;
      });
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("mouseup", handleEnd);
    document.addEventListener("touchend", handleEnd);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("mouseup", handleEnd);
      document.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedPlanet(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      {/* 星空背景 */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 pointer-events-none"
        aria-hidden="true"
      />

      {/* ====== 下拉绳子 ====== */}
      {!isVisible && (
        <div
          className="fixed top-0 right-6 z-[100] cursor-grab select-none touch-none"
          style={{
            cursor: isDragging ? "grabbing" : "grab",
            padding: "12px 20px",
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          role="slider"
          aria-label="下拉显示宇宙"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pullProgress * 100)}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setIsVisible((v) => !v);
            }
          }}
        >
          <div className="flex flex-col items-center">
            {/* 绳子链条 */}
            {Array.from({ length: 8 }, (_, i) => (
              <div
                key={i}
                className="w-3 h-5 border-[1.5px] border-purple-400/60 rounded-full"
                style={{
                  marginTop: i === 0 ? 0 : "-2px",
                  background: `linear-gradient(180deg, rgba(167,139,250,${0.15 + i * 0.04}), rgba(192,132,252,${0.08 + i * 0.03}))`,
                  boxShadow: `0 0 ${4 + i}px rgba(167,139,250,${0.3 + i * 0.05})`,
                  transform: `scaleX(${1 - i * 0.03}) translateY(${pullProgress * 20}px)`,
                  transition: isDragging ? "none" : "transform 0.2s ease",
                }}
              />
            ))}
            {/* 发光球 */}
            <div
              className="relative w-6 h-6 mt-[-2px]"
              style={{
                background: "radial-gradient(circle at 35% 35%, #e9d5ff, #a78bfa, #7c3aed)",
                borderRadius: "50%",
                boxShadow: `0 0 ${12 + pullProgress * 20}px rgba(167,139,250,${0.8 + pullProgress * 0.2}), 0 0 ${20 + pullProgress * 30}px rgba(124,58,237,${0.5 + pullProgress * 0.3})`,
                transform: `translateY(${pullProgress * 20}px) scale(${1 + pullProgress * 0.2})`,
                transition: isDragging ? "none" : "transform 0.2s ease",
                animation: isDragging ? "none" : "pulse 2s ease-in-out infinite",
              }}
            >
              <div
                className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.7)",
                  filter: "blur(1px)",
                }}
              />
            </div>
            {/* 进度条 */}
            <div className="w-1 h-16 mt-2 bg-purple-900/30 rounded-full overflow-hidden">
              <div
                className="w-full rounded-full transition-none"
                style={{
                  height: `${pullProgress * 100}%`,
                  background: "linear-gradient(180deg, #a78bfa, #7c3aed)",
                  boxShadow: "0 0 8px rgba(167,139,250,0.6)",
                }}
              />
            </div>
            {/* 提示文字 */}
            <span
              className="mt-2 text-[11px] tracking-widest"
              style={{
                color: `rgba(167,139,250,${0.4 + pullProgress * 0.6})`,
                transform: `translateY(${pullProgress * 10}px)`,
                transition: isDragging ? "none" : "all 0.2s ease",
                animation: isDragging ? "none" : "bounce 2s ease-in-out infinite",
              }}
            >
              {pullProgress > 0 ? `${Math.round(pullProgress * 100)}%` : "下拉探索宇宙"}
            </span>
          </div>
        </div>
      )}

      {/* ====== 层切换指示器 ====== */}
      {isVisible && (
        <div className="fixed left-4 top-1/2 -translate-y-1/2 z-[160] flex flex-col gap-4">
          {(["earth", "solar", "galaxy"] as const).map((layer) => (
            <button
              key={layer}
              onClick={() => {
                setCurrentLayer(layer);
                setSelectedPlanet(null);
              }}
              className="group relative flex items-center gap-2 transition-all"
              aria-label={LAYER_INFO[layer].label}
            >
              {/* 指示点 */}
              <div
                className={`w-3 h-3 rounded-full border-2 transition-all ${
                  currentLayer === layer
                    ? "bg-purple-400 border-purple-400 scale-125 shadow-[0_0_8px_rgba(167,139,250,0.6)]"
                    : "bg-transparent border-purple-400/40 hover:border-purple-400/80"
                }`}
              />
              {/* 标签（hover 显示） */}
              <span
                className={`text-xs tracking-wider transition-all whitespace-nowrap ${
                  currentLayer === layer
                    ? "text-purple-300 opacity-100 translate-x-0"
                    : "text-purple-300/0 group-hover:text-purple-300/60 group-hover:translate-x-0 -translate-x-2"
                }`}
              >
                {LAYER_INFO[layer].icon} {LAYER_INFO[layer].label}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* ====== 顶部控制栏 ====== */}
      {isVisible && (
        <div className="fixed top-4 right-4 z-[160] flex flex-col gap-2">
          <button
            className="bg-purple-500/20 border border-purple-500/40 text-white/70 px-4 py-2 rounded-full text-sm backdrop-blur-md hover:bg-purple-500/40 transition-colors"
            onClick={() => { setIsVisible(false); setSelectedPlanet(null); }}
            aria-label="收起"
          >
            ✕ 收起
          </button>
          <div className="bg-purple-500/20 border border-purple-500/40 text-white/70 px-3 py-2 rounded-full text-sm backdrop-blur-md flex items-center gap-2">
            <span className="text-xs">速度</span>
            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={timeSpeed}
              onChange={(e) => setTimeSpeed(parseFloat(e.target.value))}
              className="w-20 accent-purple-400"
            />
            <span className="text-xs w-8">{timeSpeed.toFixed(1)}x</span>
          </div>
        </div>
      )}

      {/* ====== 主视图区域 ====== */}
      <div
        className="fixed inset-0 z-50 transition-all duration-500 ease-out"
        style={{
          opacity: isVisible ? 1 : 0,
          pointerEvents: isVisible ? "auto" : "none",
        }}
      >
        {/* 地球层 */}
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{
            opacity: currentLayer === "earth" ? 1 : 0,
            transform: currentLayer === "earth" ? "scale(1)" : "scale(0.9)",
            pointerEvents: currentLayer === "earth" ? "auto" : "none",
            background: "radial-gradient(ellipse at center, #0a0a2e 0%, #000000 70%)",
          }}
        >
          <EarthSystem timeSpeed={timeSpeed} />
        </div>

        {/* 太阳系层 */}
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{
            opacity: currentLayer === "solar" ? 1 : 0,
            transform: currentLayer === "solar" ? "scale(1)" : "scale(1.1)",
            pointerEvents: currentLayer === "solar" ? "auto" : "none",
            background: "radial-gradient(ellipse at center, #0a0a2e 0%, #000000 70%)",
          }}
        >
          {/* 太阳 */}
          <button
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full z-10 cursor-pointer hover:scale-110 transition-transform"
            style={{
              background: "radial-gradient(circle at 35% 35%, #fff7ad, #ffa500, #ff4500)",
              boxShadow: "0 0 40px rgba(255,165,0,0.8), 0 0 80px rgba(255,69,0,0.5), 0 0 120px rgba(255,165,0,0.3)",
              animation: "sunGlow 3s ease-in-out infinite",
            }}
            onClick={() => setSelectedPlanet(SUN)}
            aria-label="太阳 - 点击查看参数"
          />

          {/* 行星轨道 */}
          {PLANETS.map((planet) => {
            const r = planet.orbitRadius * orbitScale;
            return (
              <div
                key={`orbit-${planet.nameEn}`}
                className="absolute top-1/2 left-1/2 rounded-full border border-white/[0.08] pointer-events-none"
                style={{ width: r * 2, height: r * 2, marginLeft: -r, marginTop: -r }}
              />
            );
          })}

          {/* 行星 */}
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

        {/* 银河系层 */}
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{
            opacity: currentLayer === "galaxy" ? 1 : 0,
            transform: currentLayer === "galaxy" ? "scale(1)" : "scale(1.2)",
            pointerEvents: currentLayer === "galaxy" ? "auto" : "none",
          }}
        >
          <GalaxyView timeSpeed={timeSpeed} />
        </div>
      </div>

      {/* ====== 行星参数面板（太阳系层） ====== */}
      {currentLayer === "solar" && (
        <PlanetPanel
          body={selectedPlanet}
          onClose={() => setSelectedPlanet(null)}
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
