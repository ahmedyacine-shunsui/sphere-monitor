/**
 * TrendChart.jsx — white theme
 */

import {
  ResponsiveContainer, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine,
} from "recharts";

function formatTime(iso) {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
}

const CustomTooltip = ({ active, payload, label, unit }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px",
        padding: "10px 14px", fontFamily: "monospace", fontSize: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      }}>
        <div style={{ color: "#94a3b8", marginBottom: "4px" }}>{label}</div>
        <div style={{ color: payload[0].color, fontWeight: "700", fontSize: "16px" }}>
          {payload[0].value?.toFixed(2)} {unit}
        </div>
      </div>
    );
  }
  return null;
};

export function TrendChart({ data, label, unit, color = "#002866", min, max }) {
  const formatted = data.map((d) => ({ ...d, time: formatTime(d.timestamp) }));
  const tickInterval = Math.max(1, Math.floor(formatted.length / 6));

  return (
    <div style={{
      background: "#ffffff", border: "1px solid #e2e8f0",
      borderRadius: "16px", padding: "20px 24px",
      boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
    }}>
      <div style={{
        fontFamily: "'Rajdhani', monospace", fontSize: "11px",
        letterSpacing: "3px", color: "#94a3b8",
        textTransform: "uppercase", marginBottom: "16px",
      }}>
        {label} — Tendance en temps réel
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={formatted} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={`grad-${label}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.15} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" />
          <XAxis dataKey="time"
            tick={{ fill: "#cbd5e1", fontFamily: "monospace", fontSize: 10 }}
            axisLine={false} tickLine={false} interval={tickInterval} />
          <YAxis
            tick={{ fill: "#cbd5e1", fontFamily: "monospace", fontSize: 10 }}
            axisLine={false} tickLine={false} domain={["auto", "auto"]}
            width={40} tickFormatter={(v) => v.toFixed(0)} />
          <Tooltip content={<CustomTooltip unit={unit} />} />
          {max !== undefined && (
            <ReferenceLine y={max} stroke="#dc2626" strokeDasharray="4 2" strokeOpacity={0.5}
              label={{ value: `MAX ${max}`, fill: "#dc2626", fontSize: 9, fontFamily: "monospace", position: "insideTopRight" }} />
          )}
          {min !== undefined && (
            <ReferenceLine y={min} stroke="#f59e0b" strokeDasharray="4 2" strokeOpacity={0.5}
              label={{ value: `MIN ${min}`, fill: "#f59e0b", fontSize: 9, fontFamily: "monospace", position: "insideBottomRight" }} />
          )}
          <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2}
            fill={`url(#grad-${label})`} dot={false} isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
