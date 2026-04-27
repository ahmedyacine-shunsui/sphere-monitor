/**
 * AProposView.jsx
 * ---------------
 * Project info: team, university, site, tech stack.
 */

import naftalLogo from "../assets/LogoNAFTAL.svg";

function InfoRow({ label, value }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "flex-start",
      padding: "12px 0", borderBottom: "1px solid #f1f5f9",
    }}>
      <div style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "1px", color: "#94a3b8", minWidth: "160px" }}>
        {label}
      </div>
      <div style={{ fontFamily: "monospace", fontSize: "11px", color: "#334155", textAlign: "right" }}>
        {value}
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{
      background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "16px",
      padding: "24px", boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
    }}>
      <div style={{
        fontFamily: "monospace", fontSize: "9px", letterSpacing: "3px",
        color: "#94a3b8", textTransform: "uppercase", marginBottom: "4px",
      }}>
        {title}
      </div>
      <div style={{ width: "32px", height: "2px", background: "#F0B41E", marginBottom: "16px", borderRadius: "2px" }} />
      {children}
    </div>
  );
}

const TECH_STACK = [
  { name: "React + Vite",   role: "Interface utilisateur",         color: "#002866" },
  { name: "Recharts",       role: "Graphiques de tendance",        color: "#002866" },
  { name: "Socket.IO",      role: "Données temps réel",            color: "#059669" },
  { name: "Node.js + Express", role: "Serveur backend",            color: "#475569" },
  { name: "MQTT (Mosquitto)", role: "Protocole capteurs IoT",      color: "#d97706" },
  { name: "InfluxDB",       role: "Base de données temporelles",   color: "#7c3aed" },
  { name: "Docker",         role: "Déploiement conteneurisé",      color: "#0891b2" },
  { name: "Nodemailer",     role: "Notifications par email",       color: "#dc2626" },
];

export function AProposView() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Hero card */}
      <div style={{
        background: "#002866", borderRadius: "16px", padding: "28px 32px",
        display: "flex", alignItems: "center", gap: "28px",
        boxShadow: "0 4px 20px rgba(0,40,102,0.15)",
      }}>
        <img src={naftalLogo} alt="NAFTAL" style={{ height: "50px", width: "auto", filter: "brightness(0) invert(1)" }} />
        <div style={{ width: "1px", height: "50px", background: "rgba(255,255,255,0.15)" }} />
        <div>
          <div style={{ fontFamily: "'Rajdhani'", fontSize: "18px", fontWeight: "700", color: "#ffffff", letterSpacing: "2px" }}>
            SYSTÈME DE SURVEILLANCE GPL
          </div>
          <div style={{ fontFamily: "monospace", fontSize: "10px", color: "rgba(255,255,255,0.5)", marginTop: "4px", letterSpacing: "1px" }}>
            Monitoring en temps réel des sphères de carburant — District Batna
          </div>
        </div>
        <div style={{ marginLeft: "auto", textAlign: "right" }}>
          <div style={{ fontFamily: "'Rajdhani'", fontSize: "13px", color: "#F0B41E", letterSpacing: "2px" }}>v1.0.0</div>
          <div style={{ fontFamily: "monospace", fontSize: "9px", color: "rgba(255,255,255,0.3)", marginTop: "2px" }}>2025/2026</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>

        {/* Project info */}
        <Section title="Projet">
          <InfoRow label="Entreprise d'accueil" value="NAFTAL — GPL Batna" />
          <InfoRow label="Site" value="Zone Industrielle Kechida, Batna" />
          <InfoRow label="Encadreur entreprise" value="Eng. Khalil" />
          <InfoRow label="Objet" value="Surveillance sphères carburant" />
          <InfoRow label="Sphère surveillée" value="N°1 — GPL" />
          <InfoRow label="Métriques" value="Pression (bar) · Température (°C)" />
        </Section>

        {/* Team */}
        <Section title="Équipe">
          <InfoRow label="Étudiant 1" value="Bensalah Aymen" />
          <InfoRow label="Étudiant 2" value="Benmohammed Abderahman" />
          <InfoRow label="Étudiant 3" value="Rahmouni Ahmed Yacine" />
          <InfoRow label="Université" value="Université Batna 2" />
          <InfoRow label="Spécialité" value="Génie Informatique — Réseaux" />
          <InfoRow label="Année" value="4ème année · 2025/2026" />
        </Section>
      </div>

      {/* Tech stack */}
      <Section title="Technologies utilisées">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "10px" }}>
          {TECH_STACK.map((tech) => (
            <div key={tech.name} style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "10px 14px", background: "#f8fafc",
              border: "1px solid #f1f5f9", borderRadius: "8px",
              borderLeft: `3px solid ${tech.color}`,
            }}>
              <div>
                <div style={{ fontFamily: "'Rajdhani'", fontSize: "13px", fontWeight: "700", color: tech.color, letterSpacing: "1px" }}>
                  {tech.name}
                </div>
                <div style={{ fontFamily: "monospace", fontSize: "9px", color: "#94a3b8", marginTop: "1px" }}>
                  {tech.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Thresholds */}
      <Section title="Seuils de sécurité configurés">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          {[
            { label: "Pression minimale", value: "120 bar", icon: "▼", color: "#d97706" },
            { label: "Pression maximale", value: "180 bar", icon: "▲", color: "#dc2626" },
            { label: "Température minimale", value: "5 °C",  icon: "▼", color: "#d97706" },
            { label: "Température maximale", value: "50 °C", icon: "▲", color: "#dc2626" },
          ].map((s) => (
            <div key={s.label} style={{
              display: "flex", alignItems: "center", gap: "12px",
              padding: "12px 16px", background: "#f8fafc",
              border: "1px solid #f1f5f9", borderRadius: "8px",
            }}>
              <div style={{
                width: "28px", height: "28px", borderRadius: "6px",
                background: `${s.color}18`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "12px", color: s.color,
              }}>{s.icon}</div>
              <div>
                <div style={{ fontFamily: "monospace", fontSize: "9px", color: "#94a3b8" }}>{s.label}</div>
                <div style={{ fontFamily: "'Rajdhani'", fontSize: "16px", fontWeight: "700", color: s.color }}>{s.value}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

    </div>
  );
}
