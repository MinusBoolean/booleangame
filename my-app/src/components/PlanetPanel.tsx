"use client";

interface CelestialBody {
  name: string;
  nameEn: string;
  diameter: number;
  distance: number;
  orbitalPeriod: number;
  moons: number;
  temperature: string;
  color: string;
  size?: number;
  orbitRadius?: number;
  description?: string;
}

interface PlanetPanelProps {
  body: CelestialBody | null;
  onClose: () => void;
  distanceLabel?: string;
  distanceUnit?: string;
}

function lightenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, ((num >> 8) & 0x00ff) + amt);
  const B = Math.min(255, (num & 0x0000ff) + amt);
  return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
}

export function PlanetPanel({ body, onClose, distanceLabel = "距太阳", distanceUnit = "百万km" }: PlanetPanelProps) {
  if (!body) return null;

  return (
    <>
      {/* 遮罩层 */}
      <div
        className="fixed inset-0 z-[150]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 面板 */}
      <div
        className="fixed z-[200] bottom-0 left-0 right-0 w-full md:top-1/2 md:bottom-auto md:right-10 md:left-auto md:w-[300px] md:-translate-y-1/2"
        style={{
          background: "rgba(10,5,30,0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(107,78,230,0.4)",
          borderRadius: "16px 16px 0 0",
          padding: "28px",
          boxShadow: "0 0 40px rgba(107,78,230,0.2)",
          animation: "slideUp 0.35s cubic-bezier(0.16,1,0.3,1)",
        }}
        role="dialog"
        aria-label={`${body.name}参数`}
      >
        <button
          className="absolute top-3 right-4 text-white/50 text-2xl hover:text-white transition-colors bg-transparent border-none cursor-pointer"
          onClick={onClose}
          aria-label="关闭面板"
        >
          &times;
        </button>

        {/* 天体视觉 */}
        <div
          className="w-[60px] h-[60px] rounded-full mb-4"
          style={{
            background: `radial-gradient(circle at 35% 35%, ${lightenColor(body.color, 40)}, ${body.color})`,
            boxShadow: `0 0 20px ${body.color}66`,
          }}
        />

        {/* 名称 */}
        <div
          className="text-2xl font-light tracking-wider mb-2"
          style={{
            background: "linear-gradient(90deg, #a78bfa, #c084fc)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {body.name} {body.nameEn}
        </div>

        {/* 描述 */}
        {body.description && (
          <p className="text-xs text-white/40 mb-4 leading-relaxed">
            {body.description}
          </p>
        )}

        {/* 参数列表 */}
        {[
          { label: "直径", value: `${body.diameter.toLocaleString()} km` },
          { label: distanceLabel, value: body.distance > 0 ? `${body.distance.toLocaleString()} ${distanceUnit}` : "中心" },
          { label: "公转周期", value: body.orbitalPeriod > 0 ? `${body.orbitalPeriod.toLocaleString()} 天` : "—" },
          { label: "卫星数", value: body.moons > 0 ? String(body.moons) : "—" },
          { label: "表面温度", value: body.temperature },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="flex justify-between items-center py-2.5 border-b border-white/[0.06] last:border-b-0"
          >
            <span className="text-sm text-white/50">{label}</span>
            <span className="text-[0.95rem] text-white/90 font-medium">{value}</span>
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @media (min-width: 768px) {
          @keyframes slideUp {
            from {
              transform: translate(120%, -50%);
              opacity: 0;
            }
            to {
              transform: translate(0, -50%);
              opacity: 1;
            }
          }
        }
      `}</style>
    </>
  );
}
