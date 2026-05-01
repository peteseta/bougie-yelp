import { useState, useEffect } from "react";
import { useTheme, useColors, UI_FONT } from "./spotify-utils.jsx";

const homeTrips = [
  { month: "Feb '25", sentiment: 0.501, label: "Quick trip home" },
  { month: "May '25", sentiment: 0.782, label: "Summer at home" },
  { month: "Dec '25", sentiment: 0.8, label: "NYE in Bangkok" },
];

export default function HomeTrips() {
  const [mounted, setMounted] = useState(false);
  const dark = useTheme();
  const C = useColors(dark);

  useEffect(() => { setMounted(true); }, []);

  return (
    <div style={{
      opacity: mounted ? 1 : 0,
      transition: "opacity 0.6s ease",
      display: "flex",
      gap: 0,
      background: C.card,
      border: `1px solid ${C.border}`,
      borderRadius: 8,
      overflow: "hidden",
    }}>
      {homeTrips.map((trip, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            padding: "24px 20px",
            borderRight: i < homeTrips.length - 1 ? `1px solid ${C.border}` : "none",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 11, color: C.textFaint, fontFamily: UI_FONT, marginBottom: 4 }}>
            {trip.month}
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, fontFamily: UI_FONT, color: C.green, lineHeight: 1 }}>
            {trip.sentiment.toFixed(3)}
          </div>
          <div style={{ fontSize: 12, color: C.textLight, marginTop: 6, fontFamily: UI_FONT }}>
            {trip.label}
          </div>
        </div>
      ))}
    </div>
  );
}
