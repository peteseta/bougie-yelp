import { useState, useEffect } from "react";

export const FONT = "'Source Serif 4', Georgia, serif";
export const UI_FONT = "'IBM Plex Mono', monospace";

export function fm(m) {
  if (!m) return "";
  const [y, mo] = m.split("-");
  const n = ["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${n[+mo]} '${y.slice(2)}`;
}

export function useTheme() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const html = document.documentElement;
    const update = () => setDark(html.getAttribute("data-theme") === "dark");
    update();
    const observer = new MutationObserver(update);
    observer.observe(html, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);
  return dark;
}

export function useColors(dark) {
  if (dark) {
    return {
      text: "#E8E4DF",
      textLight: "#B0A99E",
      textFaint: "#7A7368",
      textGhost: "#3D3832",
      card: "#2A2622",
      border: "#3D3832",
      accent: "#D9654A",
      accentSoft: "rgba(217, 101, 74, 0.12)",
      green: "#6AAE78",
      blue: "#6A94AD",
      purple: "#8E6AAD",
      warm: "#D9A84A",
      genres: {
        indie: "#6AAE78",
        pop: "#D9654A",
        electronic: "#6A94AD",
        "r&b": "#8E6AAD",
        "hip-hop": "#D9A84A",
        rock: "#AD6A6A",
        jazz: "#AD9A6A",
      },
      themes: {
        love: "#D9654A",
        heartbreak: "#6A94AD",
        empowerment: "#D9A84A",
        escapism: "#8E6AAD",
        nostalgia: "#6AAE78",
      },
    };
  }
  return {
    text: "#1A1A1A",
    textLight: "#6B6B68",
    textFaint: "#9A9A96",
    textGhost: "#D4D4CE",
    card: "#FFFFFF",
    border: "#E8E8E2",
    accent: "#C44D2B",
    accentSoft: "rgba(196, 77, 43, 0.08)",
    green: "#4A8C5C",
    blue: "#4A6E8C",
    purple: "#6E4A8C",
    warm: "#C49030",
    genres: {
      indie: "#4A8C5C",
      pop: "#C44D2B",
      electronic: "#4A6E8C",
      "r&b": "#6E4A8C",
      "hip-hop": "#C49030",
      rock: "#8C4A4A",
      jazz: "#8C7A4A",
    },
    themes: {
      love: "#C44D2B",
      heartbreak: "#4A6E8C",
      empowerment: "#C49030",
      escapism: "#6E4A8C",
      nostalgia: "#4A8C5C",
    },
  };
}

export function ChartTooltip({ active, payload, label, colors }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: colors.card,
      border: `1px solid ${colors.border}`,
      borderRadius: 6,
      padding: "8px 12px",
      fontSize: 12,
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    }}>
      <div style={{ fontWeight: 600, color: colors.text, marginBottom: 2, fontFamily: FONT }}>
        {fm(label)}
      </div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || colors.textLight, display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: p.color, display: "inline-block" }} />
          {p.name}:{" "}
          {typeof p.value === "number"
            ? p.name === "sentiment" ? p.value.toFixed(3) : p.value
            : p.value}
        </div>
      ))}
    </div>
  );
}

export function Annotation({ children, style, colors }) {
  return (
    <div style={{
      fontSize: 11,
      color: colors.textFaint,
      fontFamily: FONT,
      letterSpacing: "0.01em",
      lineHeight: 1.5,
      marginTop: 8,
      ...style,
    }}>
      {children}
    </div>
  );
}

export function GenreLegend({ colors }) {
  return (
    <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 10 }}>
      {Object.entries(colors.genres).map(([g, col]) => (
        <div key={g} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: colors.textLight }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: col }} />
          {g}
        </div>
      ))}
    </div>
  );
}
