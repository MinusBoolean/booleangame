"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  brightness: number;
}

interface Constellation {
  name: string;
  nameEn: string;
  description: string;
  ra: number; // 赤经 (hours, 0-24)
  dec: number; // 赤纬 (degrees, -90 to +90)
  stars: Star[];
  connections: [number, number][];
}

// 按真实赤经/赤纬排布的星座数据
const CONSTELLATIONS: Constellation[] = [
  {
    name: "猎户座", nameEn: "Orion",
    description: "冬季最显眼的星座，拥有猎户座大星云（M42）。腰带三星排列整齐。",
    ra: 5.5, dec: 0,
    stars: [
      { x: 0, y: 0, size: 6, brightness: 1 },
      { x: 50, y: -5, size: 5.5, brightness: 0.95 },
      { x: 25, y: 25, size: 3.5, brightness: 0.7 },
      { x: 25, y: 35, size: 3.5, brightness: 0.7 },
      { x: -15, y: 55, size: 4, brightness: 0.8 },
      { x: 60, y: 50, size: 4.5, brightness: 0.85 },
    ],
    connections: [[0, 2], [2, 3], [3, 1], [2, 4], [3, 5]],
  },
  {
    name: "金牛座", nameEn: "Taurus",
    description: "黄道十二宫之一，包含著名的毕宿星团和蟹状星云。",
    ra: 4.5, dec: 15,
    stars: [
      { x: 0, y: 0, size: 6, brightness: 1 },
      { x: 35, y: -20, size: 3.5, brightness: 0.7 },
      { x: -25, y: 15, size: 3, brightness: 0.65 },
      { x: 50, y: 10, size: 4, brightness: 0.75 },
      { x: 20, y: 40, size: 3.5, brightness: 0.7 },
    ],
    connections: [[2, 0], [0, 1], [1, 3], [0, 4]],
  },
  {
    name: "双子座", nameEn: "Gemini",
    description: "黄道十二宫之一，双子座流星雨是年度最稳定的流星雨之一。",
    ra: 7, dec: 25,
    stars: [
      { x: 0, y: 0, size: 5.5, brightness: 0.95 },
      { x: 15, y: -30, size: 5.5, brightness: 1 },
      { x: 25, y: -55, size: 3.5, brightness: 0.7 },
      { x: -5, y: -50, size: 3, brightness: 0.65 },
      { x: 10, y: 20, size: 3.5, brightness: 0.7 },
    ],
    connections: [[0, 4], [0, 1], [1, 2], [1, 3]],
  },
  {
    name: "室女座", nameEn: "Virgo",
    description: "黄道十二宫之一，包含明亮的角宿一（Spica）。室女座超星系团是银河系所在超星系团。",
    ra: 13, dec: -5,
    stars: [
      { x: 0, y: 0, size: 5.5, brightness: 0.95 },
      { x: 40, y: -25, size: 3.5, brightness: 0.7 },
      { x: 65, y: -10, size: 3, brightness: 0.65 },
      { x: 30, y: 20, size: 4, brightness: 0.75 },
      { x: -20, y: 15, size: 3.5, brightness: 0.7 },
    ],
    connections: [[0, 1], [1, 2], [0, 3], [0, 4]],
  },
  {
    name: "天蝎座", nameEn: "Scorpius",
    description: "黄道十二宫之一，拥有红色的心宿二（Antares），是红超巨星。",
    ra: 16.5, dec: -30,
    stars: [
      { x: 0, y: 0, size: 6, brightness: 1 },
      { x: -20, y: -25, size: 4, brightness: 0.8 },
      { x: 25, y: 15, size: 3.5, brightness: 0.7 },
      { x: 45, y: 25, size: 3, brightness: 0.65 },
      { x: 55, y: 40, size: 4, brightness: 0.75 },
      { x: 40, y: 55, size: 3.5, brightness: 0.7 },
    ],
    connections: [[1, 0], [0, 2], [2, 3], [3, 4], [4, 5]],
  },
  {
    name: "白羊座", nameEn: "Aries",
    description: "黄道十二宫之首，春分点曾在此星座（现已移至双鱼座）。",
    ra: 2, dec: 20,
    stars: [
      { x: 0, y: 0, size: 5, brightness: 0.9 },
      { x: 30, y: -15, size: 4, brightness: 0.8 },
      { x: 50, y: 5, size: 3.5, brightness: 0.7 },
    ],
    connections: [[0, 1], [1, 2]],
  },
  {
    name: "狮子座", nameEn: "Leo",
    description: "黄道十二宫之一，拥有轩辕十四（Regulus）等亮星。春季最容易辨认的星座。",
    ra: 10.5, dec: 15,
    stars: [
      { x: 0, y: 0, size: 5.5, brightness: 0.95 },
      { x: -30, y: -20, size: 4, brightness: 0.8 },
      { x: -50, y: -10, size: 3.5, brightness: 0.7 },
      { x: 20, y: 20, size: 4.5, brightness: 0.85 },
      { x: 40, y: 10, size: 3.5, brightness: 0.7 },
    ],
    connections: [[2, 1], [1, 0], [0, 3], [3, 4]],
  },
  {
    name: "大熊座", nameEn: "Ursa Major",
    description: "包含北斗七星，是北半球最著名的星座之一。北斗指向北极星。",
    ra: 11, dec: 55,
    stars: [
      { x: 0, y: 0, size: 5, brightness: 0.9 },
      { x: 35, y: -5, size: 4.5, brightness: 0.85 },
      { x: 60, y: 10, size: 4, brightness: 0.8 },
      { x: 55, y: 40, size: 4.5, brightness: 0.85 },
      { x: 25, y: 50, size: 4, brightness: 0.75 },
      { x: -10, y: 35, size: 3.5, brightness: 0.7 },
      { x: -20, y: 10, size: 3, brightness: 0.65 },
    ],
    connections: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 0]],
  },
  {
    name: "天琴座", nameEn: "Lyra",
    description: "包含织女星（Vega），是北半球第二亮的恒星。牛郎织女传说中的织女。",
    ra: 18.5, dec: 38,
    stars: [
      { x: 0, y: 0, size: 6, brightness: 1 },
      { x: 25, y: -30, size: 3, brightness: 0.6 },
      { x: 35, y: -15, size: 3, brightness: 0.6 },
      { x: 35, y: 10, size: 3, brightness: 0.6 },
      { x: 25, y: 25, size: 3, brightness: 0.6 },
    ],
    connections: [[1, 2], [2, 3], [3, 4], [1, 0], [4, 0]],
  },
  {
    name: "天鹰座", nameEn: "Aquila",
    description: "包含牛郎星（Altair），与织女星隔银河相望。牛郎织女传说中的牛郎。",
    ra: 19.5, dec: 10,
    stars: [
      { x: 0, y: 0, size: 5.5, brightness: 0.95 },
      { x: -20, y: -25, size: 3.5, brightness: 0.7 },
      { x: 20, y: -20, size: 3, brightness: 0.65 },
      { x: -10, y: 30, size: 3.5, brightness: 0.7 },
      { x: 15, y: 25, size: 3, brightness: 0.65 },
    ],
    connections: [[1, 0], [0, 2], [1, 3], [2, 4]],
  },
  {
    name: "仙女座", nameEn: "Andromeda",
    description: "包含仙女座星系（M31），是肉眼可见的最远天体之一，距地球254万光年。",
    ra: 1, dec: 40,
    stars: [
      { x: 0, y: 0, size: 5, brightness: 0.9 },
      { x: 30, y: -20, size: 4, brightness: 0.8 },
      { x: 55, y: -45, size: 4.5, brightness: 0.85 },
      { x: 75, y: -65, size: 3.5, brightness: 0.7 },
      { x: 20, y: 15, size: 3, brightness: 0.6 },
      { x: -15, y: 25, size: 3.5, brightness: 0.7 },
    ],
    connections: [[0, 1], [1, 2], [2, 3], [0, 4], [0, 5]],
  },
  {
    name: "飞马座", nameEn: "Pegasus",
    description: "秋季四边形是辨认秋季星空的重要标志。包含首颗被发现的系外行星。",
    ra: 22.5, dec: 20,
    stars: [
      { x: 0, y: 0, size: 5, brightness: 0.95 },
      { x: 50, y: -10, size: 4, brightness: 0.8 },
      { x: 45, y: 40, size: 4, brightness: 0.75 },
      { x: -5, y: 45, size: 4, brightness: 0.8 },
    ],
    connections: [[0, 1], [1, 2], [2, 3], [3, 0]],
  },
  {
    name: "英仙座", nameEn: "Perseus",
    description: "包含著名的英仙座流星雨辐射点。与仙后座、仙女座相邻。",
    ra: 3.5, dec: 45,
    stars: [
      { x: 0, y: 0, size: 5, brightness: 0.9 },
      { x: 30, y: -20, size: 4, brightness: 0.8 },
      { x: 55, y: -5, size: 4.5, brightness: 0.85 },
      { x: 40, y: 25, size: 3.5, brightness: 0.7 },
      { x: 10, y: 30, size: 3, brightness: 0.65 },
    ],
    connections: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0]],
  },
  {
    name: "仙后座", nameEn: "Cassiopeia",
    description: "以其独特的W形排列闻名，是北天最易辨认的星座之一。终年不落。",
    ra: 1, dec: 60,
    stars: [
      { x: -30, y: 10, size: 4.5, brightness: 0.85 },
      { x: -10, y: -10, size: 5, brightness: 0.9 },
      { x: 10, y: 5, size: 4.5, brightness: 0.85 },
      { x: 30, y: -8, size: 4, brightness: 0.8 },
      { x: 45, y: 12, size: 4, brightness: 0.8 },
    ],
    connections: [[0, 1], [1, 2], [2, 3], [3, 4]],
  },
];

// 赤经/赤纬 → 屏幕坐标（含 pan/zoom 变换）
function raDecToScreen(
  ra: number, dec: number,
  w: number, h: number,
  pan: { x: number; y: number },
  zoom: number,
): { x: number; y: number } {
  const baseX = (ra / 24) * w;
  const baseY = ((90 - dec) / 120) * h;
  return {
    x: (baseX - w / 2) * zoom + w / 2 + pan.x,
    y: (baseY - h / 2) * zoom + h / 2 + pan.y,
  };
}

// 固定种子的伪随机（背景星不随 re-render 闪烁）
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

interface GalaxyViewProps {
  timeSpeed?: number;
}

export function GalaxyView(_props: GalaxyViewProps) {
  const [selectedConstellation, setSelectedConstellation] = useState<Constellation | null>(null);
  const [hoveredConstellation, setHoveredConstellation] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ w: 1200, h: 800 });

  // pan/zoom 状态
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  // zoom ref（wheel 回调中读取最新值）
  const zoomRef = useRef(zoom);
  useEffect(() => { zoomRef.current = zoom; }, [zoom]);

  // 拖拽状态
  const isDragging = useRef(false);
  const hasDragged = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const panStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const update = () => setDimensions({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // 绘制背景 + 星座
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { w, h } = dimensions;
    canvas.width = w;
    canvas.height = h;

    const pan = panOffset;
    const z = zoom;

    // 深色背景（不动）
    ctx.fillStyle = "#050510";
    ctx.fillRect(0, 0, w, h);

    // 银河带渐变（不动）
    const gradient = ctx.createLinearGradient(0, 0, w, h);
    gradient.addColorStop(0, "rgba(60,40,100,0)");
    gradient.addColorStop(0.3, "rgba(80,50,120,0.08)");
    gradient.addColorStop(0.5, "rgba(100,60,140,0.15)");
    gradient.addColorStop(0.7, "rgba(80,50,120,0.08)");
    gradient.addColorStop(1, "rgba(60,40,100,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    // 随机背景星（跟随 pan/zoom）
    const rng = seededRandom(42);
    for (let i = 0; i < 300; i++) {
      const baseX = rng() * w;
      const baseY = rng() * h;
      const sx = (baseX - w / 2) * z + w / 2 + pan.x;
      const sy = (baseY - h / 2) * z + h / 2 + pan.y;
      if (sx < -10 || sx > w + 10 || sy < -10 || sy > h + 10) continue;
      const size = rng() * 1.5 + 0.3;
      const alpha = rng() * 0.6 + 0.2;
      ctx.beginPath();
      ctx.arc(sx, sy, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fill();
    }

    // 赤纬参考线（跟随 pan/zoom）
    ctx.strokeStyle = "rgba(167,139,250,0.06)";
    ctx.lineWidth = 0.5;
    ctx.setLineDash([4, 8]);
    for (let dec = -20; dec <= 80; dec += 20) {
      const p1 = raDecToScreen(0, dec, w, h, pan, z);
      const p2 = raDecToScreen(24, dec, w, h, pan, z);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // 赤纬标签
    ctx.font = "10px sans-serif";
    ctx.fillStyle = "rgba(167,139,250,0.2)";
    ctx.textAlign = "left";
    for (let dec = -20; dec <= 80; dec += 20) {
      const p = raDecToScreen(0.3, dec, w, h, pan, z);
      if (p.y > -20 && p.y < h + 20) {
        ctx.fillText(`${dec > 0 ? "+" : ""}${dec}°`, p.x, p.y - 4);
      }
    }

    // 赤经标签
    ctx.textAlign = "center";
    for (let ra = 0; ra < 24; ra += 4) {
      const p = raDecToScreen(ra, -25, w, h, pan, z);
      if (p.x > -30 && p.x < w + 30) {
        ctx.fillText(`${ra}h`, p.x, p.y + 14);
      }
    }

    // 绘制所有星座
    for (const c of CONSTELLATIONS) {
      drawConstellation(ctx, c, hoveredConstellation === c.nameEn, selectedConstellation?.nameEn === c.nameEn, w, h, pan, z);
    }
  }, [dimensions, hoveredConstellation, selectedConstellation, panOffset, zoom]);

  const drawConstellation = (
    ctx: CanvasRenderingContext2D, c: Constellation,
    isHovered: boolean, isSelected: boolean,
    w: number, h: number,
    pan: { x: number; y: number }, z: number,
  ) => {
    const pos = raDecToScreen(c.ra, c.dec, w, h, pan, z);
    const cx = pos.x;
    const cy = pos.y;
    const s = Math.min(w, h) / 800 * z;
    const active = isHovered || isSelected;

    // 连线
    ctx.strokeStyle = active ? "rgba(167,139,250,0.6)" : "rgba(167,139,250,0.2)";
    ctx.lineWidth = active ? 1.5 : 0.8;
    for (const [i, j] of c.connections) {
      const star1 = c.stars[i];
      const star2 = c.stars[j];
      ctx.beginPath();
      ctx.moveTo(cx + star1.x * s, cy + star1.y * s);
      ctx.lineTo(cx + star2.x * s, cy + star2.y * s);
      ctx.stroke();
    }

    // 星星
    for (const star of c.stars) {
      const x = cx + star.x * s;
      const y = cy + star.y * s;
      const size = star.size * s * (active ? 1.3 : 1);
      const alpha = star.brightness * (active ? 1 : 0.75);

      // 光晕
      const glow = ctx.createRadialGradient(x, y, 0, x, y, size * 3);
      glow.addColorStop(0, `rgba(167,139,250,${alpha * 0.3})`);
      glow.addColorStop(1, "rgba(167,139,250,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, size * 3, 0, Math.PI * 2);
      ctx.fill();

      // 星星本体
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fill();
    }

    // 名称
    ctx.font = `${active ? "14px" : "12px"} sans-serif`;
    ctx.fillStyle = active ? "rgba(167,139,250,0.9)" : "rgba(167,139,250,0.45)";
    ctx.textAlign = "center";
    ctx.fillText(c.name, cx, cy + 70 * s);
    ctx.font = `${active ? "11px" : "10px"} sans-serif`;
    ctx.fillStyle = active ? "rgba(167,139,250,0.7)" : "rgba(167,139,250,0.25)";
    ctx.fillText(c.nameEn, cx, cy + 85 * s);
  };

  // --- 拖拽交互 ---
  const handlePointerDown = useCallback((clientX: number, clientY: number) => {
    isDragging.current = true;
    hasDragged.current = false;
    dragStart.current = { x: clientX, y: clientY };
    panStart.current = { ...panOffset };
  }, [panOffset]);

  const handlePointerMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging.current) return;
    const dx = clientX - dragStart.current.x;
    const dy = clientY - dragStart.current.y;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasDragged.current = true;
    setPanOffset({
      x: panStart.current.x + dx,
      y: panStart.current.y + dy,
    });
  }, []);

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  // 鼠标事件
  const onMouseDown = (e: React.MouseEvent) => handlePointerDown(e.clientX, e.clientY);
  const onMouseMove = (e: React.MouseEvent) => {
    handlePointerMove(e.clientX, e.clientY);
    // 悬停检测
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const { w, h } = dimensions;
    const s = Math.min(w, h) / 800 * zoom;
    for (const c of CONSTELLATIONS) {
      const pos = raDecToScreen(c.ra, c.dec, w, h, panOffset, zoom);
      const dist = Math.sqrt((mx - pos.x) ** 2 + (my - pos.y) ** 2);
      if (dist < 80 * s) {
        setHoveredConstellation(c.nameEn);
        if (canvasRef.current) canvasRef.current.style.cursor = isDragging.current ? "grabbing" : "pointer";
        return;
      }
    }
    setHoveredConstellation(null);
    if (canvasRef.current) canvasRef.current.style.cursor = isDragging.current ? "grabbing" : "default";
  };
  const onMouseUp = () => handlePointerUp();
  const onMouseLeave = () => handlePointerUp();

  // 触摸事件
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      e.preventDefault();
      handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };
  const onTouchEnd = () => handlePointerUp();

  // 滚轮缩放（以鼠标位置为锚点）— 用原生事件避免 passive 问题
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const w = rect.width;
      const h = rect.height;

      const currentZoom = zoomRef.current;
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.max(0.5, Math.min(3, currentZoom * zoomFactor));
      const scale = newZoom / currentZoom;

      // 用函数式更新同步读取最新 pan
      setPanOffset((prevPan) => ({
        x: mx - (mx - prevPan.x - w / 2) * scale - w / 2,
        y: my - (my - prevPan.y - h / 2) * scale - h / 2,
      }));
      setZoom(newZoom);
    };

    canvas.addEventListener("wheel", handleWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", handleWheel);
  }, []);

  // 点击检测（区分拖拽和点击）
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (hasDragged.current) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const { w, h } = dimensions;
    const s = Math.min(w, h) / 800 * zoom;

    for (const c of CONSTELLATIONS) {
      const pos = raDecToScreen(c.ra, c.dec, w, h, panOffset, zoom);
      const dist = Math.sqrt((mx - pos.x) ** 2 + (my - pos.y) ** 2);
      if (dist < 80 * s) {
        setSelectedConstellation(selectedConstellation?.nameEn === c.nameEn ? null : c);
        return;
      }
    }
    setSelectedConstellation(null);
  };

  // 重置视图
  const resetView = () => {
    setPanOffset({ x: 0, y: 0 });
    setZoom(1);
  };

  // 小地图点击跳转
  const handleMinimapClick = useCallback((ra: number, dec: number) => {
    const { w, h } = dimensions;
    const targetX = (ra / 24) * w;
    const targetY = ((90 - dec) / 120) * h;
    setPanOffset({
      x: (w / 2 - targetX) * zoom + w / 2 - w / 2,
      y: (h / 2 - targetY) * zoom + h / 2 - h / 2,
    });
    // 简化：panOffset = -(targetBase - center) * zoom
    setPanOffset({
      x: -(targetX - w / 2) * zoom,
      y: -(targetY - h / 2) * zoom,
    });
  }, [dimensions, zoom]);

  return (
    <>
      {/* 星座 Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ cursor: "default" }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={handleCanvasClick}
      />

      {/* 指南针 */}
      <CompassRose />

      {/* 缩放控制 */}
      <div className="absolute bottom-6 left-6 z-20 flex flex-col gap-1">
        <button
          className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/30 text-white/60 text-lg flex items-center justify-center hover:bg-purple-500/40 transition-colors"
          onClick={() => setZoom((z) => Math.min(3, z * 1.2))}
          aria-label="放大"
        >
          +
        </button>
        <button
          className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/30 text-white/60 text-lg flex items-center justify-center hover:bg-purple-500/40 transition-colors"
          onClick={() => setZoom((z) => Math.max(0.5, z * 0.8))}
          aria-label="缩小"
        >
          −
        </button>
        <button
          className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/30 text-white/40 text-[10px] flex items-center justify-center hover:bg-purple-500/40 transition-colors mt-1"
          onClick={resetView}
          aria-label="重置视图"
        >
          ↺
        </button>
        <span className="text-[10px] text-purple-400/30 text-center mt-1">{zoom.toFixed(1)}x</span>
      </div>

      {/* 小地图 */}
      <Minimap
        panOffset={panOffset}
        zoom={zoom}
        dimensions={dimensions}
        onConstellationClick={handleMinimapClick}
      />

      {/* 选中星座的信息卡片 */}
      {selectedConstellation && (
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 px-6 py-4 rounded-2xl backdrop-blur-md"
          style={{
            background: "rgba(20,10,40,0.7)",
            border: "1px solid rgba(167,139,250,0.3)",
            maxWidth: 400,
            animation: "fadeIn 0.3s ease",
          }}
        >
          <h3
            className="text-lg font-light tracking-wider mb-1"
            style={{
              background: "linear-gradient(90deg, #a78bfa, #c084fc)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {selectedConstellation.name} {selectedConstellation.nameEn}
          </h3>
          <p className="text-xs text-white/50 leading-relaxed">
            {selectedConstellation.description}
          </p>
          <p className="text-[10px] text-purple-400/40 mt-2">
            赤经 {selectedConstellation.ra.toFixed(1)}h · 赤纬 {selectedConstellation.dec > 0 ? "+" : ""}{selectedConstellation.dec}°
          </p>
        </div>
      )}

      {/* 拖拽提示 */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 text-[10px] text-purple-400/20 pointer-events-none">
        拖拽平移 · 滚轮缩放
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </>
  );
}

// 指南针组件 — 天球方位
function CompassRose() {
  const size = 80;
  const cx = size / 2;
  const cy = size / 2;
  const r = 30;

  return (
    <div className="absolute top-6 right-6 z-20" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(167,139,250,0.2)" strokeWidth="1" />
        <circle cx={cx} cy={cy} r={r - 8} fill="none" stroke="rgba(167,139,250,0.1)" strokeWidth="0.5" />
        <line x1={cx} y1={cy - r + 4} x2={cx} y2={cy + r - 4} stroke="rgba(167,139,250,0.1)" strokeWidth="0.5" />
        <line x1={cx - r + 4} y1={cy} x2={cx + r - 4} y2={cy} stroke="rgba(167,139,250,0.1)" strokeWidth="0.5" />
        {/* 北 */}
        <polygon points={`${cx},${cy - r + 2} ${cx - 4},${cy - 6} ${cx + 4},${cy - 6}`} fill="rgba(167,139,250,0.7)" />
        {/* 南 */}
        <polygon points={`${cx},${cy + r - 2} ${cx - 4},${cy + 6} ${cx + 4},${cy + 6}`} fill="rgba(167,139,250,0.3)" />
        {/* 东（左） */}
        <polygon points={`${cx - r + 2},${cy} ${cx - 6},${cy - 4} ${cx - 6},${cy + 4}`} fill="rgba(167,139,250,0.3)" />
        {/* 西（右） */}
        <polygon points={`${cx + r - 2},${cy} ${cx + 6},${cy - 4} ${cx + 6},${cy + 4}`} fill="rgba(167,139,250,0.3)" />
        <text x={cx} y={cy - r - 4} textAnchor="middle" fill="rgba(167,139,250,0.8)" fontSize="10" fontFamily="sans-serif">N</text>
        <text x={cx} y={cy + r + 12} textAnchor="middle" fill="rgba(167,139,250,0.4)" fontSize="10" fontFamily="sans-serif">S</text>
        <text x={cx - r - 6} y={cy + 4} textAnchor="middle" fill="rgba(167,139,250,0.5)" fontSize="10" fontFamily="sans-serif">E</text>
        <text x={cx + r + 6} y={cy + 4} textAnchor="middle" fill="rgba(167,139,250,0.5)" fontSize="10" fontFamily="sans-serif">W</text>
        <circle cx={cx} cy={cy} r={2} fill="rgba(167,139,250,0.5)" />
      </svg>
    </div>
  );
}

// 小地图组件
function Minimap({
  panOffset,
  zoom,
  dimensions,
  onConstellationClick,
}: {
  panOffset: { x: number; y: number };
  zoom: number;
  dimensions: { w: number; h: number };
  onConstellationClick: (ra: number, dec: number) => void;
}) {
  const mmW = 160;
  const mmH = 100;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = mmW;
    canvas.height = mmH;

    // 背景
    ctx.fillStyle = "rgba(10,5,20,0.8)";
    ctx.fillRect(0, 0, mmW, mmH);
    ctx.strokeStyle = "rgba(167,139,250,0.2)";
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, mmW, mmH);

    // 星座点
    for (const c of CONSTELLATIONS) {
      const x = (c.ra / 24) * mmW;
      const y = ((90 - c.dec) / 120) * mmH;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(167,139,250,0.6)";
      ctx.fill();
    }

    // 当前视口矩形
    const { w, h } = dimensions;
    // 视口中心在天球上的位置
    const viewCenterX = (w / 2 - panOffset.x) / zoom;
    const viewCenterY = (h / 2 - panOffset.y) / zoom;
    // 视口在小地图上的宽高
    const viewW = (w / zoom) * (mmW / w);
    const viewH = (h / zoom) * (mmH / h);
    const viewX = (viewCenterX / w) * mmW - viewW / 2;
    const viewY = (viewCenterY / h) * mmH - viewH / 2;

    ctx.strokeStyle = "rgba(167,139,250,0.5)";
    ctx.lineWidth = 1;
    ctx.strokeRect(viewX, viewY, viewW, viewH);
    ctx.fillStyle = "rgba(167,139,250,0.05)";
    ctx.fillRect(viewX, viewY, viewW, viewH);
  }, [panOffset, zoom, dimensions]);

  const handleClick = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const ra = (mx / mmW) * 24;
    const dec = 90 - (my / mmH) * 120;
    onConstellationClick(ra, dec);
  };

  return (
    <div className="absolute bottom-6 right-6 z-20">
      <canvas
        ref={canvasRef}
        width={mmW}
        height={mmH}
        className="rounded-lg cursor-pointer"
        style={{ width: mmW, height: mmH }}
        onClick={handleClick}
      />
      <p className="text-[9px] text-purple-400/25 text-center mt-1">点击跳转</p>
    </div>
  );
}
