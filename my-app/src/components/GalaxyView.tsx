"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  brightness: number;
  name?: string; // 恒星名称
  type?: string; // 恒星类型
  magnitude?: number; // 视星等
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
      { x: 0, y: 0, size: 6, brightness: 1, name: "参宿四", type: "红超巨星", magnitude: 0.5 },      // Betelgeuse, α Ori
      { x: 50, y: -5, size: 5.5, brightness: 0.95, name: "参宿七", type: "蓝超巨星", magnitude: 0.13 }, // Rigel, β Ori
      { x: 15, y: 20, size: 3.5, brightness: 0.7, name: "参宿三", type: "蓝巨星", magnitude: 2.23 },   // Mintaka, δ Ori (腰带)
      { x: 25, y: 25, size: 3.5, brightness: 0.7, name: "参宿二", type: "蓝超巨星", magnitude: 1.69 }, // Alnilam, ε Ori (腰带)
      { x: 35, y: 30, size: 3.5, brightness: 0.7, name: "参宿一", type: "蓝巨星", magnitude: 1.77 },   // Alnitak, ζ Ori (腰带)
      { x: -15, y: 50, size: 4, brightness: 0.8, name: "参宿六", type: "蓝超巨星", magnitude: 2.06 },  // Saiph, κ Ori
      { x: 60, y: 45, size: 4.5, brightness: 0.85, name: "参宿五", type: "蓝巨星", magnitude: 1.64 },  // Bellatrix, γ Ori
    ],
    connections: [[0, 2], [2, 3], [3, 4], [4, 1], [2, 5], [4, 6]],
  },
  {
    name: "金牛座", nameEn: "Taurus",
    description: "黄道十二宫之一，包含著名的毕宿星团和蟹状星云。",
    ra: 4.5, dec: 15,
    stars: [
      { x: 0, y: 0, size: 6, brightness: 1, name: "毕宿五", type: "红巨星", magnitude: 0.85 },        // Aldebaran, α Tau
      { x: 35, y: -20, size: 3.5, brightness: 0.7, name: "毕宿一", type: "蓝白巨星", magnitude: 3.53 }, // Prima Hyadum, γ Tau
      { x: -25, y: 15, size: 3, brightness: 0.65, name: "毕宿四", type: "橙巨星", magnitude: 3.54 },   // Ain, ε Tau
      { x: 50, y: 10, size: 4, brightness: 0.75, name: "天关", type: "蓝白巨星", magnitude: 3.0 },     // Tianguan, ζ Tau
      { x: 20, y: 40, size: 3.5, brightness: 0.7, name: "毕宿三", type: "蓝白巨星", magnitude: 3.4 },  // Prima Hyadum, δ Tau
    ],
    connections: [[2, 0], [0, 1], [1, 3], [0, 4]],
  },
  {
    name: "双子座", nameEn: "Gemini",
    description: "黄道十二宫之一，双子座流星雨是年度最稳定的流星雨之一。",
    ra: 7, dec: 25,
    stars: [
      { x: 0, y: 0, size: 5.5, brightness: 0.95, name: "北河二", type: "蓝白巨星", magnitude: 1.58 },  // Castor, α Gem
      { x: 15, y: -30, size: 5.5, brightness: 1, name: "北河三", type: "橙巨星", magnitude: 1.14 },    // Pollux, β Gem
      { x: 25, y: -55, size: 3.5, brightness: 0.7, name: "井宿七", type: "蓝白巨星", magnitude: 3.06 }, // Wasat, δ Gem
      { x: -5, y: -50, size: 3, brightness: 0.65, name: "井宿三", type: "蓝白主序星", magnitude: 3.28 }, // Mebsuta, ε Gem
      { x: 10, y: 20, size: 3.5, brightness: 0.7, name: "井宿一", type: "蓝白巨星", magnitude: 2.88 },  // Tejat, μ Gem
    ],
    connections: [[0, 4], [0, 1], [1, 2], [1, 3]],
  },
  {
    name: "室女座", nameEn: "Virgo",
    description: "黄道十二宫之一，包含明亮的角宿一（Spica）。室女座超星系团是银河系所在超星系团。",
    ra: 13, dec: -5,
    stars: [
      { x: 0, y: 0, size: 5.5, brightness: 0.95, name: "角宿一", type: "蓝巨星", magnitude: 0.97 },   // Spica, α Vir
      { x: 40, y: -25, size: 3.5, brightness: 0.7, name: "太微右垣一", type: "蓝白主序星", magnitude: 3.44 }, // Zavijava, β Vir
      { x: 65, y: -10, size: 3, brightness: 0.65, name: "太微右垣二", type: "蓝白主序星", magnitude: 3.38 }, // Porrima, γ Vir
      { x: 30, y: 20, size: 4, brightness: 0.75, name: "东次相", type: "蓝白主序星", magnitude: 3.53 },   // Vindemiatrix, ε Vir
      { x: -20, y: 15, size: 3.5, brightness: 0.7, name: "太微左垣一", type: "蓝白主序星", magnitude: 3.65 }, // η Vir
    ],
    connections: [[0, 1], [1, 2], [0, 3], [0, 4]],
  },
  {
    name: "天蝎座", nameEn: "Scorpius",
    description: "黄道十二宫之一，拥有红色的心宿二（Antares），是红超巨星。",
    ra: 16.5, dec: -30,
    stars: [
      { x: 0, y: 0, size: 6, brightness: 1, name: "心宿二", type: "红超巨星", magnitude: 0.96 },     // Antares, α Sco
      { x: -20, y: -25, size: 4, brightness: 0.8, name: "房宿三", type: "蓝白巨星", magnitude: 2.29 }, // Graffias, β Sco
      { x: 25, y: -10, size: 3.5, brightness: 0.7, name: "尾宿二", type: "蓝白巨星", magnitude: 1.63 }, // Dschubba, δ Sco
      { x: 40, y: 5, size: 3, brightness: 0.65, name: "尾宿三", type: "蓝白巨星", magnitude: 2.29 },  // Fang, π Sco
      { x: 35, y: 20, size: 4, brightness: 0.75, name: "尾宿五", type: "蓝白巨星", magnitude: 1.87 }, // Sargas, θ Sco
      { x: 20, y: 30, size: 3.5, brightness: 0.7, name: "尾宿八", type: "蓝白巨星", magnitude: 2.69 }, // ε Sco
    ],
    connections: [[1, 0], [0, 2], [2, 3], [3, 4], [4, 5]],
  },
  {
    name: "白羊座", nameEn: "Aries",
    description: "黄道十二宫之首，春分点曾在此星座（现已移至双鱼座）。",
    ra: 2, dec: 20,
    stars: [
      { x: 0, y: 0, size: 5, brightness: 0.9, name: "娄宿三", type: "橙巨星", magnitude: 2.0 },    // Hamal, α Ari
      { x: 30, y: -15, size: 4, brightness: 0.8, name: "娄宿一", type: "蓝白主序星", magnitude: 2.64 }, // Sheratan, β Ari
      { x: 50, y: 5, size: 3.5, brightness: 0.7, name: "娄宿二", type: "蓝白主序星", magnitude: 3.88 }, // Mesarthim, γ Ari
    ],
    connections: [[0, 1], [1, 2]],
  },
  {
    name: "狮子座", nameEn: "Leo",
    description: "黄道十二宫之一，拥有轩辕十四（Regulus）等亮星。春季最容易辨认的星座。",
    ra: 10.5, dec: 15,
    stars: [
      { x: 0, y: 0, size: 5.5, brightness: 0.95, name: "轩辕十四", type: "蓝白主序星", magnitude: 1.4 }, // Regulus, α Leo
      { x: -30, y: -20, size: 4, brightness: 0.8, name: "轩辕十三", type: "橙巨星", magnitude: 2.0 },  // Algieba, γ Leo
      { x: -50, y: -10, size: 3.5, brightness: 0.7, name: "轩辕十二", type: "橙巨星", magnitude: 3.4 }, // Zosma, δ Leo
      { x: 20, y: 20, size: 4.5, brightness: 0.85, name: "轩辕九", type: "蓝白主序星", magnitude: 2.14 }, // Denebola, β Leo
      { x: 40, y: 10, size: 3.5, brightness: 0.7, name: "轩辕八", type: "蓝白巨星", magnitude: 3.3 },   // Chertan, θ Leo
    ],
    connections: [[2, 1], [1, 0], [0, 3], [3, 4]],
  },
  {
    name: "大熊座", nameEn: "Ursa Major",
    description: "包含北斗七星，是北半球最著名的星座之一。北斗指向北极星。",
    ra: 11, dec: 55,
    stars: [
      { x: 0, y: 0, size: 5, brightness: 0.9, name: "天枢", type: "橙巨星", magnitude: 1.79 },   // Dubhe, α UMa
      { x: 35, y: -5, size: 4.5, brightness: 0.85, name: "天璇", type: "蓝白主序星", magnitude: 2.37 }, // Merak, β UMa
      { x: 60, y: 10, size: 4, brightness: 0.8, name: "天玑", type: "蓝白主序星", magnitude: 2.44 },  // Phecda, γ UMa
      { x: 55, y: 40, size: 4.5, brightness: 0.85, name: "天权", type: "蓝白主序星", magnitude: 3.31 }, // Megrez, δ UMa
      { x: 25, y: 50, size: 4, brightness: 0.75, name: "玉衡", type: "蓝白巨星", magnitude: 1.77 },   // Alioth, ε UMa
      { x: -10, y: 35, size: 3.5, brightness: 0.7, name: "开阳", type: "蓝白主序星", magnitude: 2.27 }, // Mizar, ζ UMa
      { x: -20, y: 10, size: 3, brightness: 0.65, name: "摇光", type: "蓝白主序星", magnitude: 1.86 },  // Alkaid, η UMa
    ],
    connections: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 0]],
  },
  {
    name: "天琴座", nameEn: "Lyra",
    description: "包含织女星（Vega），是北半球第二亮的恒星。牛郎织女传说中的织女。",
    ra: 18.5, dec: 38,
    stars: [
      { x: 0, y: 0, size: 6, brightness: 1, name: "织女一", type: "蓝白主序星", magnitude: 0.03 },  // Vega, α Lyr
      { x: 25, y: -30, size: 3, brightness: 0.6, name: "渐台二", type: "蓝白巨星", magnitude: 3.24 }, // Sheliak, β Lyr
      { x: 35, y: -15, size: 3, brightness: 0.6, name: "渐台三", type: "蓝白巨星", magnitude: 3.3 },  // Sulafat, γ Lyr
      { x: 35, y: 10, size: 3, brightness: 0.6, name: "渐台一", type: "蓝白巨星", magnitude: 4.3 },   // δ Lyr
      { x: 25, y: 25, size: 3, brightness: 0.6, name: "渐台四", type: "蓝白巨星", magnitude: 3.7 },   // ζ Lyr
    ],
    connections: [[1, 2], [2, 3], [3, 4], [1, 0], [4, 0]],
  },
  {
    name: "天鹰座", nameEn: "Aquila",
    description: "包含牛郎星（Altair），与织女星隔银河相望。牛郎织女传说中的牛郎。",
    ra: 19.5, dec: 10,
    stars: [
      { x: 0, y: 0, size: 5.5, brightness: 0.95, name: "河鼓二", type: "蓝白主序星", magnitude: 0.76 }, // Altair, α Aql
      { x: -20, y: -25, size: 3.5, brightness: 0.7, name: "河鼓一", type: "蓝白主序星", magnitude: 2.72 }, // Alshain, β Aql
      { x: 20, y: -20, size: 3, brightness: 0.65, name: "河鼓三", type: "蓝白巨星", magnitude: 2.99 },   // Tarazed, γ Aql
      { x: -10, y: 30, size: 3.5, brightness: 0.7, name: "天桴四", type: "蓝白主序星", magnitude: 3.4 },  // δ Aql
      { x: 15, y: 25, size: 3, brightness: 0.65, name: "天桴三", type: "蓝白巨星", magnitude: 3.8 },     // ζ Aql
    ],
    connections: [[1, 0], [0, 2], [1, 3], [2, 4]],
  },
  {
    name: "仙女座", nameEn: "Andromeda",
    description: "包含仙女座星系（M31），是肉眼可见的最远天体之一，距地球254万光年。",
    ra: 1, dec: 40,
    stars: [
      { x: 0, y: 0, size: 5, brightness: 0.9, name: "壁宿二", type: "蓝白巨星", magnitude: 2.06 },   // Alpheratz, α And
      { x: 30, y: -20, size: 4, brightness: 0.8, name: "奎宿九", type: "蓝白巨星", magnitude: 2.05 },  // Mirach, β And
      { x: 55, y: -45, size: 4.5, brightness: 0.85, name: "奎宿五", type: "橙巨星", magnitude: 2.1 },  // Almach, γ And
      { x: 75, y: -65, size: 3.5, brightness: 0.7, name: "奎宿八", type: "蓝白主序星", magnitude: 3.3 }, // δ And
      { x: 20, y: 15, size: 3, brightness: 0.6, name: "壁宿一", type: "蓝白主序星", magnitude: 4.5 },   // ε And
      { x: -15, y: 25, size: 3.5, brightness: 0.7, name: "奎宿六", type: "蓝白主序星", magnitude: 3.5 }, // ζ And
    ],
    connections: [[0, 1], [1, 2], [2, 3], [0, 4], [0, 5]],
  },
  {
    name: "飞马座", nameEn: "Pegasus",
    description: "秋季四边形是辨认秋季星空的重要标志。包含首颗被发现的系外行星。",
    ra: 22.5, dec: 20,
    stars: [
      { x: 0, y: 0, size: 5, brightness: 0.95, name: "室宿一", type: "蓝白巨星", magnitude: 2.39 },  // Markab, α Peg
      { x: 50, y: -10, size: 4, brightness: 0.8, name: "室宿二", type: "蓝白巨星", magnitude: 2.42 }, // Scheat, β Peg
      { x: 45, y: 40, size: 4, brightness: 0.75, name: "壁宿一", type: "蓝白巨星", magnitude: 2.83 }, // Algenib, γ Peg
      { x: -5, y: 45, size: 4, brightness: 0.8, name: "壁宿二", type: "蓝白主序星", magnitude: 3.5 },  // η Peg (注：实际是仙女座α)
    ],
    connections: [[0, 1], [1, 2], [2, 3], [3, 0]],
  },
  {
    name: "英仙座", nameEn: "Perseus",
    description: "包含著名的英仙座流星雨辐射点。与仙后座、仙女座相邻。",
    ra: 3.5, dec: 45,
    stars: [
      { x: 0, y: 0, size: 5, brightness: 0.9, name: "天船三", type: "蓝白超巨星", magnitude: 1.8 },   // Mirfak, α Per
      { x: 30, y: -20, size: 4, brightness: 0.8, name: "大陵五", type: "蓝白主序星", magnitude: 2.12 }, // Algol, β Per
      { x: 55, y: -5, size: 4.5, brightness: 0.85, name: "天船一", type: "蓝白主序星", magnitude: 2.9 }, // γ Per
      { x: 40, y: 25, size: 3.5, brightness: 0.7, name: "天船二", type: "蓝白巨星", magnitude: 3.0 },   // δ Per
      { x: 10, y: 30, size: 3, brightness: 0.65, name: "天大将军一", type: "蓝白主序星", magnitude: 3.4 }, // ε Per
    ],
    connections: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0]],
  },
  {
    name: "仙后座", nameEn: "Cassiopeia",
    description: "以其独特的W形排列闻名，是北天最易辨认的星座之一。终年不落。",
    ra: 1, dec: 60,
    stars: [
      { x: -30, y: 10, size: 4.5, brightness: 0.85, name: "策", type: "蓝白巨星", magnitude: 2.24 },   // Caph, β Cas
      { x: -10, y: -10, size: 5, brightness: 0.9, name: "王良一", type: "蓝白主序星", magnitude: 2.23 },  // Schedar, α Cas
      { x: 10, y: 5, size: 4.5, brightness: 0.85, name: "王良四", type: "蓝白巨星", magnitude: 2.47 },   // Navi, γ Cas
      { x: 30, y: -8, size: 4, brightness: 0.8, name: "阁道二", type: "蓝白巨星", magnitude: 2.68 },     // Ruchbah, δ Cas
      { x: 45, y: 12, size: 4, brightness: 0.8, name: "阁道一", type: "蓝白巨星", magnitude: 3.37 },     // Segin, ε Cas
    ],
    connections: [[0, 1], [1, 2], [2, 3], [3, 4]],
  },
  // 南半球星座
  {
    name: "南十字座", nameEn: "Crux",
    description: "南半球最著名的星座，是澳大利亚、新西兰等国国旗上的标志。指引南天极方向。",
    ra: 12.5, dec: -60,
    stars: [
      { x: 0, y: -25, size: 5, brightness: 0.95, name: "十字架二", type: "蓝巨星", magnitude: 0.77 },  // Acrux, α Cru
      { x: 0, y: 25, size: 4.5, brightness: 0.85, name: "十字架一", type: "蓝白巨星", magnitude: 1.25 }, // Gacrux, γ Cru
      { x: -15, y: 0, size: 4, brightness: 0.8, name: "十字架三", type: "蓝白巨星", magnitude: 1.3 },   // Mimosa, β Cru
      { x: 15, y: 0, size: 3.5, brightness: 0.7, name: "十字架四", type: "蓝白巨星", magnitude: 2.8 },  // δ Cru
    ],
    connections: [[0, 1], [2, 3]],
  },
  {
    name: "半人马座", nameEn: "Centaurus",
    description: "拥有距离太阳最近的恒星系统——南门二（半人马座α），距离仅4.37光年。",
    ra: 14, dec: -50,
    stars: [
      { x: 0, y: 0, size: 5.5, brightness: 0.95, name: "南门二", type: "蓝白主序星", magnitude: -0.01 }, // Alpha Centauri, α Cen
      { x: -25, y: -20, size: 4.5, brightness: 0.85, name: "马腹一", type: "蓝巨星", magnitude: 0.61 },   // Hadar, β Cen
      { x: 30, y: 15, size: 4, brightness: 0.8, name: "库楼七", type: "蓝白巨星", magnitude: 2.06 },      // ε Cen
      { x: 45, y: -10, size: 3.5, brightness: 0.7, name: "库楼一", type: "蓝白巨星", magnitude: 2.2 },    // θ Cen
      { x: 15, y: 35, size: 3.5, brightness: 0.7, name: "库楼三", type: "蓝白巨星", magnitude: 2.3 },     // ι Cen
    ],
    connections: [[0, 1], [0, 2], [2, 3], [0, 4]],
  },
  {
    name: "船底座", nameEn: "Carina",
    description: "包含老人星（Canopus），是全天第二亮星。原为南船座的一部分。",
    ra: 9, dec: -60,
    stars: [
      { x: 0, y: 0, size: 6, brightness: 1, name: "老人星", type: "黄白色超巨星", magnitude: -0.74 },  // Canopus, α Car
      { x: -30, y: -25, size: 4, brightness: 0.8, name: "海石一", type: "蓝白巨星", magnitude: 1.68 },  // Miaplacidus, β Car
      { x: 25, y: 20, size: 3.5, brightness: 0.7, name: "海石二", type: "蓝白巨星", magnitude: 2.74 }, // ε Car
      { x: -15, y: 30, size: 3, brightness: 0.65, name: "南船三", type: "蓝白巨星", magnitude: 3.3 },  // ι Car
    ],
    connections: [[0, 1], [0, 2], [0, 3]],
  },
];

// 赤经/赤纬 → 屏幕坐标（含 pan/zoom 变换）
// RA: 0-24h, Dec: -90° 到 +90°
function raDecToScreen(
  ra: number, dec: number,
  w: number, h: number,
  pan: { x: number; y: number },
  zoom: number,
): { x: number; y: number } {
  const baseX = (ra / 24) * w;
  const baseY = ((90 - dec) / 180) * h;
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
  const [selectedStar, setSelectedStar] = useState<{ constellation: Constellation; star: Star } | null>(null);
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

    // 赤纬参考线（跟随 pan/zoom）- 范围 -90° 到 +90°
    ctx.strokeStyle = "rgba(167,139,250,0.1)";
    ctx.lineWidth = 0.5;
    ctx.setLineDash([4, 8]);
    for (let dec = -80; dec <= 80; dec += 20) {
      const p1 = raDecToScreen(0, dec, w, h, pan, z);
      const p2 = raDecToScreen(24, dec, w, h, pan, z);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // 赤纬标签
    ctx.font = "12px sans-serif";
    ctx.textAlign = "left";
    for (let dec = -80; dec <= 80; dec += 20) {
      const p = raDecToScreen(0.3, dec, w, h, pan, z);
      if (p.y > -20 && p.y < h + 20) {
        // 背景
        const text = `${dec > 0 ? "+" : ""}${dec}°`;
        const metrics = ctx.measureText(text);
        ctx.fillStyle = "rgba(5,5,16,0.7)";
        ctx.fillRect(p.x - 2, p.y - 14, metrics.width + 4, 16);
        // 文字
        ctx.fillStyle = "rgba(167,139,250,0.5)";
        ctx.fillText(text, p.x, p.y - 2);
      }
    }

    // 赤经参考线
    ctx.strokeStyle = "rgba(167,139,250,0.06)";
    ctx.lineWidth = 0.5;
    ctx.setLineDash([4, 8]);
    for (let ra = 0; ra < 24; ra += 2) {
      const p1 = raDecToScreen(ra, -90, w, h, pan, z);
      const p2 = raDecToScreen(ra, 90, w, h, pan, z);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // 赤经标签
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    for (let ra = 0; ra < 24; ra += 4) {
      const p = raDecToScreen(ra, -85, w, h, pan, z);
      if (p.x > -30 && p.x < w + 30) {
        // 背景
        const text = `${ra}h`;
        const metrics = ctx.measureText(text);
        ctx.fillStyle = "rgba(5,5,16,0.7)";
        ctx.fillRect(p.x - metrics.width / 2 - 4, p.y + 2, metrics.width + 8, 18);
        // 文字
        ctx.fillStyle = "rgba(167,139,250,0.6)";
        ctx.fillText(text, p.x, p.y + 15);
        // 小刻度线
        ctx.strokeStyle = "rgba(167,139,250,0.2)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y - 2);
        ctx.lineTo(p.x, p.y + 4);
        ctx.stroke();
      }
    }

    // 绘制所有星座
    for (const c of CONSTELLATIONS) {
      drawConstellation(ctx, c, hoveredConstellation === c.nameEn, selectedConstellation?.nameEn === c.nameEn, w, h, pan, z, selectedStar);
    }
  }, [dimensions, hoveredConstellation, selectedConstellation, selectedStar, panOffset, zoom]);

  const drawConstellation = (
    ctx: CanvasRenderingContext2D, c: Constellation,
    isHovered: boolean, isSelected: boolean,
    w: number, h: number,
    pan: { x: number; y: number }, z: number,
    selectedStarInfo?: { constellation: Constellation; star: Star } | null,
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
      const isSelectedStar = selectedStarInfo?.constellation.nameEn === c.nameEn && selectedStarInfo?.star === star;
      const size = star.size * s * (isSelectedStar ? 1.8 : active ? 1.3 : 1);
      const alpha = star.brightness * (isSelectedStar ? 1 : active ? 1 : 0.75);

      // 光晕
      const glowRadius = isSelectedStar ? size * 5 : size * 3;
      const glow = ctx.createRadialGradient(x, y, 0, x, y, glowRadius);
      if (isSelectedStar) {
        glow.addColorStop(0, "rgba(233,213,255,0.6)");
        glow.addColorStop(0.5, "rgba(167,139,250,0.3)");
        glow.addColorStop(1, "rgba(167,139,250,0)");
      } else {
        glow.addColorStop(0, `rgba(167,139,250,${alpha * 0.3})`);
        glow.addColorStop(1, "rgba(167,139,250,0)");
      }
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
      ctx.fill();

      // 星星本体
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = isSelectedStar ? "rgba(233,213,255,1)" : `rgba(255,255,255,${alpha})`;
      ctx.fill();

      // 选中恒星的名称
      if (isSelectedStar && star.name) {
        ctx.font = "bold 11px sans-serif";
        ctx.fillStyle = "rgba(233,213,255,0.9)";
        ctx.textAlign = "center";
        ctx.fillText(star.name, x, y - size - 8);
      }
    }

    // 星座名称
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

  // ESC 键清除选择
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedStar(null);
        setSelectedConstellation(null);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
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

    // 先检测是否点击了恒星
    for (const c of CONSTELLATIONS) {
      const pos = raDecToScreen(c.ra, c.dec, w, h, panOffset, zoom);
      const cx = pos.x;
      const cy = pos.y;

      for (const star of c.stars) {
        const starX = cx + star.x * s;
        const starY = cy + star.y * s;
        const starDist = Math.sqrt((mx - starX) ** 2 + (my - starY) ** 2);
        const hitRadius = Math.max(star.size * s * 2, 12); // 最小点击半径 12px

        if (starDist < hitRadius) {
          setSelectedStar({ constellation: c, star });
          setSelectedConstellation(c);
          return;
        }
      }
    }

    // 再检测是否点击了星座
    for (const c of CONSTELLATIONS) {
      const pos = raDecToScreen(c.ra, c.dec, w, h, panOffset, zoom);
      const dist = Math.sqrt((mx - pos.x) ** 2 + (my - pos.y) ** 2);
      if (dist < 80 * s) {
        setSelectedConstellation(selectedConstellation?.nameEn === c.nameEn ? null : c);
        setSelectedStar(null);
        return;
      }
    }
    setSelectedConstellation(null);
    setSelectedStar(null);
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

      {/* 选中星座的信息卡片（选中恒星时不显示） */}
      {selectedConstellation && !selectedStar && (
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

      {/* 选中恒星的信息卡片 */}
      {selectedStar && (
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 px-6 py-4 rounded-2xl backdrop-blur-md"
          style={{
            background: "rgba(20,10,40,0.85)",
            border: "1px solid rgba(167,139,250,0.4)",
            maxWidth: 350,
            animation: "fadeIn 0.3s ease",
            boxShadow: "0 0 20px rgba(167,139,250,0.2)",
          }}
        >
          <div className="flex items-center gap-3 mb-2">
            {/* 恒星图标 */}
            <div
              className="w-4 h-4 rounded-full"
              style={{
                background: "radial-gradient(circle at 35% 35%, #fff, #a78bfa)",
                boxShadow: "0 0 8px rgba(167,139,250,0.8)",
              }}
            />
            <h3
              className="text-lg font-light tracking-wider"
              style={{
                background: "linear-gradient(90deg, #e9d5ff, #c084fc)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {selectedStar.star.name || "未知恒星"}
            </h3>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-white/60">
              <span className="text-purple-300/70">所属星座：</span>
              {selectedStar.constellation.name}
            </p>
            {selectedStar.star.type && (
              <p className="text-xs text-white/60">
                <span className="text-purple-300/70">恒星类型：</span>
                {selectedStar.star.type}
              </p>
            )}
            {selectedStar.star.magnitude !== undefined && (
              <p className="text-xs text-white/60">
                <span className="text-purple-300/70">视星等：</span>
                {selectedStar.star.magnitude.toFixed(2)}
                <span className="text-white/40 ml-1">（越小越亮）</span>
              </p>
            )}
          </div>
          <p className="text-[10px] text-purple-400/30 mt-2">
            点击空白处取消选择
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
    <div className="absolute top-6 left-6 z-20 flex items-start gap-3">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
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
      {/* 说明文字 */}
      <div
        className="max-w-48 px-3 py-2 rounded-lg backdrop-blur-md"
        style={{
          background: "rgba(20,10,40,0.6)",
          border: "1px solid rgba(167,139,250,0.15)",
        }}
      >
        <p className="text-[10px] text-purple-300/70 leading-relaxed">
          星座按<span className="text-purple-300/90">赤经（RA）</span>和<span className="text-purple-300/90">赤纬（Dec）</span>真实排布。
        </p>
        <p className="text-[10px] text-purple-300/50 leading-relaxed mt-1">
          水平方向对应赤经（0~24h），垂直方向对应赤纬（-90°~+90°），覆盖全天球。
        </p>
      </div>
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
