import { useState, useEffect } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { useTheme, useColors, UI_FONT, fm, ChartTooltip } from "./spotify-utils.jsx";

const themeData = [
  { month: "2022-12", love: 20, heartbreak: 10, empowerment: 6, escapism: 3, nostalgia: 7 },
  { month: "2023-01", love: 7, heartbreak: 1, empowerment: 0, escapism: 0, nostalgia: 1 },
  { month: "2023-02", love: 6, heartbreak: 1, empowerment: 1, escapism: 1, nostalgia: 4 },
  { month: "2023-03", love: 10, heartbreak: 5, empowerment: 1, escapism: 1, nostalgia: 1 },
  { month: "2023-04", love: 13, heartbreak: 8, empowerment: 0, escapism: 3, nostalgia: 3 },
  { month: "2023-05", love: 9, heartbreak: 3, empowerment: 0, escapism: 4, nostalgia: 2 },
  { month: "2023-06", love: 4, heartbreak: 0, empowerment: 0, escapism: 1, nostalgia: 1 },
  { month: "2023-07", love: 12, heartbreak: 2, empowerment: 3, escapism: 3, nostalgia: 2 },
  { month: "2023-08", love: 9, heartbreak: 0, empowerment: 1, escapism: 3, nostalgia: 5 },
  { month: "2023-09", love: 16, heartbreak: 6, empowerment: 3, escapism: 5, nostalgia: 3 },
  { month: "2023-10", love: 10, heartbreak: 3, empowerment: 1, escapism: 1, nostalgia: 2 },
  { month: "2023-11", love: 19, heartbreak: 8, empowerment: 5, escapism: 8, nostalgia: 6 },
  { month: "2023-12", love: 16, heartbreak: 9, empowerment: 4, escapism: 4, nostalgia: 1 },
  { month: "2024-01", love: 13, heartbreak: 6, empowerment: 2, escapism: 4, nostalgia: 2 },
  { month: "2024-02", love: 32, heartbreak: 15, empowerment: 3, escapism: 4, nostalgia: 8 },
  { month: "2024-03", love: 24, heartbreak: 12, empowerment: 4, escapism: 2, nostalgia: 2 },
  { month: "2024-04", love: 20, heartbreak: 7, empowerment: 6, escapism: 6, nostalgia: 0 },
  { month: "2024-05", love: 6, heartbreak: 5, empowerment: 0, escapism: 0, nostalgia: 0 },
  { month: "2024-06", love: 14, heartbreak: 5, empowerment: 0, escapism: 3, nostalgia: 3 },
  { month: "2024-07", love: 14, heartbreak: 5, empowerment: 2, escapism: 2, nostalgia: 1 },
  { month: "2024-08", love: 3, heartbreak: 3, empowerment: 1, escapism: 1, nostalgia: 1 },
  { month: "2024-09", love: 13, heartbreak: 2, empowerment: 1, escapism: 4, nostalgia: 3 },
  { month: "2024-10", love: 12, heartbreak: 3, empowerment: 3, escapism: 3, nostalgia: 1 },
  { month: "2024-11", love: 14, heartbreak: 10, empowerment: 3, escapism: 1, nostalgia: 3 },
  { month: "2024-12", love: 9, heartbreak: 7, empowerment: 1, escapism: 3, nostalgia: 1 },
  { month: "2025-01", love: 5, heartbreak: 2, empowerment: 2, escapism: 1, nostalgia: 1 },
  { month: "2025-02", love: 13, heartbreak: 6, empowerment: 3, escapism: 2, nostalgia: 1 },
  { month: "2025-03", love: 10, heartbreak: 3, empowerment: 0, escapism: 1, nostalgia: 4 },
  { month: "2025-04", love: 8, heartbreak: 0, empowerment: 1, escapism: 1, nostalgia: 2 },
  { month: "2025-05", love: 5, heartbreak: 2, empowerment: 2, escapism: 0, nostalgia: 0 },
  { month: "2025-06", love: 9, heartbreak: 4, empowerment: 1, escapism: 1, nostalgia: 4 },
  { month: "2025-07", love: 8, heartbreak: 5, empowerment: 1, escapism: 1, nostalgia: 1 },
  { month: "2025-08", love: 15, heartbreak: 10, empowerment: 6, escapism: 2, nostalgia: 6 },
  { month: "2025-09", love: 7, heartbreak: 5, empowerment: 2, escapism: 1, nostalgia: 3 },
  { month: "2025-10", love: 8, heartbreak: 4, empowerment: 1, escapism: 1, nostalgia: 0 },
  { month: "2025-11", love: 10, heartbreak: 6, empowerment: 2, escapism: 0, nostalgia: 2 },
  { month: "2025-12", love: 9, heartbreak: 4, empowerment: 3, escapism: 5, nostalgia: 3 },
  { month: "2026-01", love: 2, heartbreak: 2, empowerment: 1, escapism: 1, nostalgia: 1 },
];

export default function ThemeChart() {
  const [mounted, setMounted] = useState(false);
  const dark = useTheme();
  const C = useColors(dark);

  useEffect(() => { setMounted(true); }, []);

  const renderTooltip = (props) => <ChartTooltip {...props} colors={C} />;

  return (
    <div style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.6s ease" }}>
      <div style={{
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 8,
        padding: "24px 16px 16px",
      }}>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={themeData} margin={{ top: 10, right: 8, bottom: 0, left: -8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
            <XAxis
              dataKey="month"
              tickFormatter={fm}
              tick={{ fill: C.textFaint, fontSize: 10, fontFamily: UI_FONT }}
              axisLine={{ stroke: C.border }}
              tickLine={false}
              interval={4}
            />
            <YAxis
              tick={{ fill: C.textFaint, fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={renderTooltip} />
            <Area type="monotone" dataKey="love" stroke={C.themes.love} fill={C.themes.love} fillOpacity={0.1} strokeWidth={2} />
            <Area type="monotone" dataKey="heartbreak" stroke={C.themes.heartbreak} fill={C.themes.heartbreak} fillOpacity={0.08} strokeWidth={1.5} />
            <Area type="monotone" dataKey="nostalgia" stroke={C.themes.nostalgia} fill={C.themes.nostalgia} fillOpacity={0.08} strokeWidth={1.5} />
            <Area type="monotone" dataKey="escapism" stroke={C.themes.escapism} fill={C.themes.escapism} fillOpacity={0.06} strokeWidth={1} />
            <Area type="monotone" dataKey="empowerment" stroke={C.themes.empowerment} fill={C.themes.empowerment} fillOpacity={0.06} strokeWidth={1} />
          </AreaChart>
        </ResponsiveContainer>
        <div style={{ display: "flex", gap: 14, marginTop: 10, flexWrap: "wrap" }}>
          {Object.entries(C.themes).map(([t, col]) => (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: C.textLight }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: col }} />
              {t}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
