"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { PlanetPanel } from "./PlanetPanel";

interface CelestialBody {
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

const EARTH: CelestialBody = {
  name: "地球",
  nameEn: "Earth",
  diameter: 12742,
  distance: 149600000,
  orbitalPeriod: 365.25,
  moons: 1,
  temperature: "15°C（平均）",
  color: "#4a90d9",
  size: 80,
  orbitRadius: 0,
  description: "人类的家园，太阳系中唯一已知存在生命的行星。拥有液态水海洋和含氧大气层。",
};

const MOON: CelestialBody = {
  name: "月球",
  nameEn: "Moon",
  diameter: 3474,
  distance: 384400,
  orbitalPeriod: 27.3,
  moons: 0,
  temperature: "-173°C ~ 127°C",
  color: "#c0c0c0",
  size: 22,
  orbitRadius: 160,
  description: "地球唯一的天然卫星。表面布满陨石坑，对地球潮汐有重要影响。",
};

const ISS: CelestialBody = {
  name: "国际空间站",
  nameEn: "ISS",
  diameter: 0.109,
  distance: 408,
  orbitalPeriod: 0.0625,
  moons: 0,
  temperature: "-157°C ~ 121°C",
  color: "#e0e0e0",
  size: 6,
  orbitRadius: 120,
  description: "人类在太空中最大的结构物，绕地球运行的轨道实验室。",
};

const SATELLITES = [MOON, ISS];

interface EarthSystemProps {
  timeSpeed?: number;
}

export function EarthSystem({ timeSpeed = 1 }: EarthSystemProps) {
  const [selectedBody, setSelectedBody] = useState<CelestialBody | null>(null);
  const [moonAngle, setMoonAngle] = useState(Math.random() * Math.PI * 2);
  const [issAngle, setIssAngle] = useState(Math.random() * Math.PI * 2);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef(0);
  const [orbitScale, setOrbitScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      setOrbitScale(Math.min(window.innerWidth, window.innerHeight) / 600);
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const animate = useCallback((timestamp: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const dt = (timestamp - lastTimeRef.current) / 1000;
    lastTimeRef.current = timestamp;

    // 月球公转 (加速到可见)
    setMoonAngle((prev) => prev + dt * 0.3 * timeSpeed);
    // ISS 公转 (更快)
    setIssAngle((prev) => prev + dt * 1.5 * timeSpeed);

    rafRef.current = requestAnimationFrame(animate);
  }, [timeSpeed]);

  useEffect(() => {
    lastTimeRef.current = 0;
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate]);

  const cx = typeof window !== "undefined" ? window.innerWidth / 2 : 500;
  const cy = typeof window !== "undefined" ? window.innerHeight / 2 : 400;

  return (
    <>
      {/* 地球大气光晕 */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          width: EARTH.size * orbitScale * 1.6,
          height: EARTH.size * orbitScale * 1.6,
          background: "radial-gradient(circle, rgba(74,144,217,0.2) 0%, rgba(74,144,217,0) 70%)",
          filter: "blur(20px)",
        }}
      />

      {/* 地球 */}
      <button
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full cursor-pointer hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-blue-400/50 z-10"
        style={{
          width: EARTH.size * orbitScale,
          height: EARTH.size * orbitScale,
          background: `radial-gradient(circle at 35% 35%, #6ab7ff, #4a90d9, #2d6bb5)`,
          boxShadow: "0 0 30px rgba(74,144,217,0.5), inset -10px -10px 20px rgba(0,0,0,0.3)",
        }}
        onClick={() => setSelectedBody(EARTH)}
        aria-label="地球 - 点击查看参数"
      >
        {/* 大陆轮廓装饰 */}
        <div
          className="absolute top-[20%] left-[30%] w-[25%] h-[30%] rounded-full opacity-30"
          style={{ background: "#2d8a4e", filter: "blur(3px)" }}
        />
        <div
          className="absolute top-[50%] left-[55%] w-[20%] h-[25%] rounded-full opacity-25"
          style={{ background: "#2d8a4e", filter: "blur(3px)" }}
        />
      </button>

      {/* 月球轨道 */}
      <div
        className="absolute top-1/2 left-1/2 rounded-full border border-white/[0.08] pointer-events-none"
        style={{
          width: MOON.orbitRadius * orbitScale * 2,
          height: MOON.orbitRadius * orbitScale * 2,
          marginLeft: -MOON.orbitRadius * orbitScale,
          marginTop: -MOON.orbitRadius * orbitScale,
        }}
      />

      {/* ISS 轨道 */}
      <div
        className="absolute top-1/2 left-1/2 rounded-full border border-white/[0.05] pointer-events-none border-dashed"
        style={{
          width: ISS.orbitRadius * orbitScale * 2,
          height: ISS.orbitRadius * orbitScale * 2,
          marginLeft: -ISS.orbitRadius * orbitScale,
          marginTop: -ISS.orbitRadius * orbitScale,
        }}
      />

      {/* 月球 */}
      <button
        className="absolute rounded-full cursor-pointer hover:scale-125 transition-transform focus:outline-none focus:ring-2 focus:ring-gray-400/50 z-10"
        style={{
          width: MOON.size * orbitScale,
          height: MOON.size * orbitScale,
          left: cx + Math.cos(moonAngle) * MOON.orbitRadius * orbitScale - (MOON.size * orbitScale) / 2,
          top: cy + Math.sin(moonAngle) * MOON.orbitRadius * orbitScale - (MOON.size * orbitScale) / 2,
          background: `radial-gradient(circle at 35% 35%, #e8e8e8, #c0c0c0, #808080)`,
          boxShadow: "0 0 10px rgba(192,192,192,0.4), inset -3px -3px 6px rgba(0,0,0,0.3)",
        }}
        onClick={() => setSelectedBody(MOON)}
        aria-label="月球 - 点击查看参数"
      >
        {/* 陨石坑装饰 */}
        <div
          className="absolute top-[25%] left-[30%] w-[15%] h-[15%] rounded-full bg-gray-500/40"
          style={{ filter: "blur(1px)" }}
        />
        <div
          className="absolute top-[55%] left-[60%] w-[10%] h-[10%] rounded-full bg-gray-500/30"
          style={{ filter: "blur(1px)" }}
        />
      </button>

      {/* ISS */}
      <button
        className="absolute rounded-sm cursor-pointer hover:scale-150 transition-transform focus:outline-none focus:ring-2 focus:ring-yellow-400/50 z-10"
        style={{
          width: ISS.size * orbitScale,
          height: ISS.size * orbitScale * 0.4,
          left: cx + Math.cos(issAngle) * ISS.orbitRadius * orbitScale - (ISS.size * orbitScale) / 2,
          top: cy + Math.sin(issAngle) * ISS.orbitRadius * orbitScale - (ISS.size * orbitScale * 0.4) / 2,
          background: `linear-gradient(90deg, #e0e0e0, #ffffff, #e0e0e0)`,
          boxShadow: "0 0 6px rgba(255,255,255,0.6)",
        }}
        onClick={() => setSelectedBody(ISS)}
        aria-label="国际空间站 - 点击查看参数"
      />

      {/* 标签 */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 text-center pointer-events-none"
        style={{ marginTop: (EARTH.size * orbitScale) / 2 + 12 }}
      >
        <span className="text-xs text-blue-300/60 tracking-wider">地球系统</span>
      </div>

      {/* 参数面板 */}
      <PlanetPanel
        body={selectedBody}
        onClose={() => setSelectedBody(null)}
        distanceLabel={selectedBody === ISS ? "距地球" : selectedBody === MOON ? "距地球" : "距太阳"}
        distanceUnit={selectedBody === ISS || selectedBody === MOON ? "km" : "百万km"}
      />
    </>
  );
}
