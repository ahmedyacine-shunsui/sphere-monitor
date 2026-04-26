/**
 * TrendChart.jsx
 * --------------
 * Line chart for one metric over time using Recharts.
 * Props:
 *   data       — array of { timestamp, value }
 *   label      — metric name string
 *   unit       — "bar" or "°C"
 *   color      — line color
 *   min / max  — threshold lines
 */

import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceLine, Area, AreaChart,
} from "recharts";

function formatTime(iso) {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
}

const CustomTooltip = ({ active, payload, label, unit }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "#0d1117",
        border: "1px solid #1f2937",
        borderRadius: "8px",
        padding: "10px 14px",
        fontFamily: "monospace",
        fontSize: "12px",
        color: "#f9fafb",
      }}>
        <div style={{ color: "#6b7280", marginBottom: "4px" }}>{label}</div>
        <div style={{ color: payload[0].color, fontWeight: "700", fontSize: "16px" }}>
          {payload[0].value?.toFixed(2)} {unit}
        </div>
      </div>
    );
  }
  return null;
};

export function TrendChart({ data, label, unit, color = "#22d3a0", min, max }) {
  const formatted = data.map((d) => ({
    ...d,
    time: formatTime(d.timestamp),
  }));

  // Show every Nth label to avoid crowding
  const tickInterval = Math.max(1, Math.floor(formatted.length / 6));

  return (
    <div style={{
      background: "linear-gradient(135deg, #0d1117 0%, #0f1520 100%)",
      border: "1px solid #1f2937",
      borderRadius: "16px",
      padding: "20px 24px",
    }}>
      <div style={{
        fontFamily: "'Rajdhani', monospace",
        fontSize: "11px",
        letterSpacing: "3px",
        color: "#6b7280",
        textTransform: "uppercase",
        marginBottom: "16px",
      }}>
        {label} — Tendance en temps réel
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={formatted} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={`grad-${label}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.2} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="#111827" strokeDasharray="3 3" />

          <XAxis
            dataKey="time"
            tick={{ fill: "#374151", fontFamily: "monospace", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            interval={tickInterval}
          />
          <YAxis
            tick={{ fill: "#374151", fontFamily: "monospace", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            domain={["auto", "auto"]}
            width={40}
            tickFormatter={(v) => v.toFixed(0)}
          />

          <Tooltip content={<CustomTooltip unit={unit} />} />

          {/* Threshold reference lines */}
          {max !== undefined && (
            <ReferenceLine y={max} stroke="#ef4444" strokeDasharray="4 2"
              strokeOpacity={0.5}
              label={{ value: `MAX ${max}`, fill: "#ef4444", fontSize: 9,
                fontFamily: "monospace", position: "insideTopRight" }} />
          )}
          {min !== undefined && (
            <ReferenceLine y={min} stroke="#f59e0b" strokeDasharray="4 2"
              strokeOpacity={0.5}
              label={{ value: `MIN ${min}`, fill: "#f59e0b", fontSize: 9,
                fontFamily: "monospace", position: "insideBottomRight" }} />
          )}

          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill={`url(#grad-${label})`}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
