import { useState, useEffect } from "react";
import { useTheme, useColors, FONT, UI_FONT, fm } from "./spotify-utils.jsx";

const artistTimeline = [
  {
    artist: "Charli xcx",
    total: 25,
    color: "#D94F7A",
    appearances: [
      { m: "2023-02", c: 1 }, { m: "2023-06", c: 1 }, { m: "2024-03", c: 1 },
      { m: "2024-06", c: 9 }, { m: "2024-07", c: 4 }, { m: "2024-09", c: 1 },
      { m: "2024-10", c: 2 }, { m: "2024-11", c: 1 }, { m: "2024-12", c: 2 },
      { m: "2025-03", c: 2 }, { m: "2025-12", c: 1 },
    ],
  },
  {
    artist: "Sabrina Carpenter",
    total: 25,
    color: "#C9884A",
    appearances: [
      { m: "2023-01", c: 1 }, { m: "2023-04", c: 3 }, { m: "2023-05", c: 1 },
      { m: "2023-07", c: 1 }, { m: "2023-12", c: 1 }, { m: "2024-04", c: 1 },
      { m: "2024-06", c: 1 }, { m: "2024-08", c: 1 }, { m: "2024-09", c: 2 },
      { m: "2024-10", c: 1 }, { m: "2024-11", c: 3 }, { m: "2025-02", c: 2 },
      { m: "2025-08", c: 5 }, { m: "2025-10", c: 1 }, { m: "2025-12", c: 1 },
    ],
  },
  {
    artist: "Taylor Swift",
    total: 21,
    color: "#7A8FBB",
    appearances: [
      { m: "2022-12", c: 1 }, { m: "2023-03", c: 1 }, { m: "2023-04", c: 1 },
      { m: "2023-05", c: 1 }, { m: "2023-09", c: 1 }, { m: "2023-10", c: 1 },
      { m: "2023-11", c: 9 }, { m: "2023-12", c: 4 }, { m: "2024-01", c: 1 },
      { m: "2024-04", c: 1 },
    ],
  },
  {
    artist: "beabadoobee",
    total: 18,
    color: "#6A9E5E",
    appearances: [
      { m: "2022-12", c: 1 }, { m: "2023-02", c: 1 }, { m: "2023-07", c: 1 },
      { m: "2023-10", c: 3 }, { m: "2024-08", c: 1 }, { m: "2024-09", c: 2 },
      { m: "2024-11", c: 2 }, { m: "2025-01", c: 1 }, { m: "2025-04", c: 3 },
      { m: "2025-08", c: 1 }, { m: "2025-09", c: 1 }, { m: "2025-10", c: 1 },
    ],
  },
  {
    artist: "Olivia Rodrigo",
    total: 14,
    color: "#BB6E99",
    appearances: [
      { m: "2023-06", c: 1 }, { m: "2023-08", c: 1 }, { m: "2023-09", c: 7 },
      { m: "2023-11", c: 1 }, { m: "2024-03", c: 3 }, { m: "2025-08", c: 1 },
    ],
  },
  {
    artist: "Troye Sivan",
    total: 14,
    color: "#8A7ABB",
    appearances: [
      { m: "2023-09", c: 1 }, { m: "2023-10", c: 5 }, { m: "2023-11", c: 2 },
      { m: "2024-06", c: 1 }, { m: "2024-07", c: 1 }, { m: "2024-10", c: 1 },
      { m: "2024-11", c: 2 }, { m: "2025-11", c: 1 },
    ],
  },
  {
    artist: "Lizzy McAlpine",
    total: 15,
    color: "#5EA0A0",
    appearances: [
      { m: "2022-12", c: 2 }, { m: "2023-02", c: 1 }, { m: "2023-03", c: 2 },
      { m: "2023-04", c: 3 }, { m: "2024-02", c: 1 }, { m: "2024-04", c: 1 },
      { m: "2024-09", c: 1 }, { m: "2025-02", c: 1 }, { m: "2025-04", c: 2 },
      { m: "2025-12", c: 1 },
    ],
  },
  {
    artist: "The 1975",
    total: 14,
    color: "#A09070",
    appearances: [
      { m: "2022-12", c: 1 }, { m: "2023-01", c: 1 }, { m: "2023-02", c: 1 },
      { m: "2023-03", c: 2 }, { m: "2023-07", c: 2 }, { m: "2023-09", c: 1 },
      { m: "2024-02", c: 4 }, { m: "2024-07", c: 1 }, { m: "2025-05", c: 1 },
    ],
  },
];

const allMonths = (() => {
  const months = [];
  const d = new Date(2022, 11);
  const end = new Date(2026, 0);
  while (d <= end) {
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    d.setMonth(d.getMonth() + 1);
  }
  return months;
})();
const monthIdx = Object.fromEntries(allMonths.map((m, i) => [m, i]));

export default function ArtistTimeline() {
  const [mounted, setMounted] = useState(false);
  const dark = useTheme();
  const C = useColors(dark);

  useEffect(() => { setMounted(true); }, []);

  return (
    <div style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.6s ease" }}>
      <div style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 8,
        padding: "24px 20px 16px",
        overflowX: "auto",
      }}>
        <div style={{ minWidth: 600 }}>
          {artistTimeline.map((artist, ai) => (
            <div
              key={artist.artist}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "7px 0",
                borderBottom: ai < artistTimeline.length - 1 ? `1px solid ${C.border}` : "none",
              }}
            >
              <div style={{ width: 130, flexShrink: 0, paddingRight: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: C.text, fontFamily: FONT }}>
                  {artist.artist}
                </div>
                <div style={{ fontSize: 10, color: C.textFaint, fontFamily: FONT }}>
                  {artist.total} tracks
                </div>
              </div>
              <div style={{ flex: 1, position: "relative", height: 24 }}>
                <div style={{
                  position: "absolute",
                  top: "50%",
                  left: 0,
                  right: 0,
                  height: 1,
                  background: C.border,
                }} />
                <div style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  width: 1,
                  left: `${(monthIdx["2024-08"] / (allMonths.length - 1)) * 100}%`,
                  background: C.accent,
                  opacity: 0.15,
                }} />
                {artist.appearances.map((a, i) => {
                  const idx = monthIdx[a.m];
                  if (idx === undefined) return null;
                  const x = (idx / (allMonths.length - 1)) * 100;
                  const size = Math.min(18, 5 + a.c * 2.2);
                  return (
                    <div
                      key={i}
                      title={`${fm(a.m)}: ${a.c} track${a.c > 1 ? "s" : ""}`}
                      style={{
                        position: "absolute",
                        left: `${x}%`,
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                        width: size,
                        height: size,
                        borderRadius: "50%",
                        background: artist.color,
                        opacity: 0.85,
                        cursor: "default",
                      }}
                    />
                  );
                })}
              </div>
            </div>
          ))}
          <div style={{
            position: "relative",
            marginLeft: 130,
            marginTop: 6,
            paddingBottom: 24,
            display: "flex",
            justifyContent: "space-between",
          }}>
            {allMonths
              .filter((_, i) => i % 6 === 0 || i === allMonths.length - 1)
              .map(m => (
                <span key={m} style={{ fontSize: 9, color: C.textFaint, fontFamily: UI_FONT }}>
                  {fm(m)}
                </span>
              ))}
            <span style={{
              position: "absolute",
              left: `${(monthIdx["2024-08"] / (allMonths.length - 1)) * 100}%`,
              transform: "translateX(-50%)",
              top: 22,
              fontSize: 9,
              fontWeight: 600,
              color: C.accent,
              fontFamily: UI_FONT,
              whiteSpace: "nowrap",
              opacity: 0.45,
            }}>
              moved to YVR
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
