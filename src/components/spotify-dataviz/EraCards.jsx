import { useState, useEffect } from "react";
import { useTheme, useColors, FONT } from "./spotify-utils.jsx";

const eras = [
  {
    era: "bangkok",
    period: "dec '22 – jul '24",
    tracks: 466,
    sentiment: "0.468",
    topGenre: "Indie (39%)",
    top: "Taylor Swift, Charli xcx, The 1975",
    colorKey: "warm",
  },
  {
    era: "moving",
    period: "aug '24",
    tracks: 28,
    sentiment: "0.602",
    topGenre: "Indie (43%)",
    top: "Sabrina Carpenter, beabadoobee, wave to earth",
    colorKey: "purple",
  },
  {
    era: "vancouver",
    period: "sep '24 – jan '26",
    tracks: 241,
    sentiment: "0.449",
    topGenre: "Indie (41%)",
    top: "Sabrina Carpenter, beabadoobee, Charli xcx",
    colorKey: "blue",
  },
];

export default function EraCards() {
  const [mounted, setMounted] = useState(false);
  const dark = useTheme();
  const C = useColors(dark);

  useEffect(() => { setMounted(true); }, []);

  return (
    <div style={{
      opacity: mounted ? 1 : 0,
      transition: "opacity 0.6s ease",
      display: "flex",
      gap: 16,
      flexWrap: "wrap",
    }}>
      {eras.map(e => (
        <div
          key={e.era}
          style={{
            flex: "1 1 180px",
            background: C.card,
            border: `1px solid ${C.border}`,
            borderRadius: 8,
            padding: 20,
            borderTop: `3px solid ${C[e.colorKey]}`,
          }}
        >
          <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 600, color: C[e.colorKey] }}>
            {e.era}
          </div>
          <div style={{ fontSize: 11, fontFamily: FONT, color: C.textFaint, marginBottom: 12 }}>
            {e.period}
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, fontFamily: FONT, color: C.text }}>
            {e.tracks}
          </div>
          <div style={{ fontSize: 11, color: C.textFaint, marginBottom: 10 }}>tracks</div>
          <div style={{ fontSize: 12, color: C.textLight, lineHeight: 1.6, fontFamily: FONT }}>
            Sentiment: <strong>{e.sentiment}</strong>
            <br />
            {e.topGenre}
            <br />
            <span style={{ color: C.textFaint }}>{e.top}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
