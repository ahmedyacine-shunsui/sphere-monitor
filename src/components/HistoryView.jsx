/**
 * HistoryView.jsx — white theme
 */

import { useState } from "react";
import { TrendChart } from "./TrendChart";
import { THRESHOLDS } from "../hooks/useSocket";

const MOCK_MODE = true;

function fetchHistoryMock(metric, hours) {
  const now = Date.now();
  const points = hours * 6;
  const ranges = { pressure: [130, 175], temperature: [10, 48] };
  const [lo, hi] = ranges[metric];
  const result = [];
  let val = (lo + hi) / 2;
  for (let i = points; i >= 0; i--) {
    val = Math.min(hi * 1.05, Math.max(lo * 0.9,
      val + (Math.random() - 0.49) * (hi - lo) * 0.04));
    result.push({
      timestamp: new Date(now - i * 10 * 60 * 1000).toISOString(),
      value: parseFloat(val.toFixed(2)),
    });
  }
  return Promise.resolve(result);
}

async function fetchHistoryReal(sphereId, metric, hours) {
  const res = await fetch(`/api/history?sphere=${sphereId}&metric=${metric}&range=${hours}h`);
  if (!res.ok) throw new Error("Erreur API");
  return res.json();
}

export function HistoryView() {
  const [range, setRange] = useState("24");
  const [pressureData, setPressureData] = useState(null);
  const [tempData, setTempData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLoad = async () => {
    setLoading(true);
    setError(null);
    try {
      const hours = parseInt(range);
      const [p, t] = await Promise.all([
        MOCK_MODE ? fetchHistoryMock("pressure", hours) : fetchHistoryReal("sphere1", "pressure", hours),
        MOCK_MODE ? fetchHistoryMock("temperature", hours) : fetchHistoryReal("sphere1", "temperature", hours),
      ]);
      setPressureData(p);
      setTempData(t);
    } catch (e) {
      setError("Impossible de charger les données historiques.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: "#ffffff", border: "1px solid #e2e8f0",
      borderRadius: "16px", padding: "24px",
      boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
    }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: "20px", flexWrap: "wrap", gap: "12px",
      }}>
        <div style={{ fontFamily: "'Rajdhani', monospace", fontSize: "11px", letterSpacing: "3px", color: "#94a3b8", textTransform: "uppercase" }}>
          Historique — Données archivées
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <select value={range} onChange={(e) => setRange(e.target.value)} style={{
            background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px",
            color: "#334155", fontFamily: "monospace", fontSize: "13px",
            padding: "8px 14px", outline: "none", cursor: "pointer",
          }}>
            <option value="1">Dernière heure</option>
            <option value="6">6 heures</option>
            <option value="24">24 heures</option>
            <option value="72">3 jours</option>
          </select>
          <button onClick={handleLoad} disabled={loading} style={{
            background: loading ? "#f1f5f9" : "#002866",
            border: "1px solid " + (loading ? "#e2e8f0" : "#002866"),
            borderRadius: "8px",
            color: loading ? "#94a3b8" : "#ffffff",
            fontFamily: "monospace", fontSize: "11px",
            letterSpacing: "2px", padding: "8px 20px",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.2s",
          }}>
            {loading ? "CHARGEMENT…" : "CHARGER"}
          </button>
        </div>
      </div>

      {error && (
        <div style={{
          color: "#dc2626", fontFamily: "monospace", fontSize: "12px",
          padding: "12px", background: "#fef2f2", borderRadius: "8px",
          border: "1px solid #fecaca",
        }}>{error}</div>
      )}

      {!pressureData && !loading && !error && (
        <div style={{ textAlign: "center", padding: "40px", color: "#cbd5e1", fontFamily: "monospace", fontSize: "12px" }}>
          Sélectionnez une plage et cliquez sur CHARGER
        </div>
      )}

      {pressureData && tempData && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <TrendChart data={pressureData} label="Pression" unit="bar" color="#002866"
            min={THRESHOLDS.pressure.min} max={THRESHOLDS.pressure.max} />
          <TrendChart data={tempData} label="Température" unit="°C" color="#F0B41E"
            min={THRESHOLDS.temperature.min} max={THRESHOLDS.temperature.max} />
        </div>
      )}
    </div>
  );
}
