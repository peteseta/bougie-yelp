import { useState, useEffect } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import { useTheme, useColors, UI_FONT, fm, ChartTooltip, Annotation, GenreLegend } from "./spotify-utils.jsx";

const streamgraphData = [
  { month: "2022-12", indie: 25, electronic: 1, pop: 6, "r&b": 0, "hip-hop": 2, rock: 0, jazz: 0 },
  { month: "2023-01", indie: 1, electronic: 1, pop: 7, "r&b": 0, "hip-hop": 1, rock: 0, jazz: 0 },
  { month: "2023-02", indie: 9, electronic: 0, pop: 2, "r&b": 1, "hip-hop": 1, rock: 0, jazz: 0 },
  { month: "2023-03", indie: 6, electronic: 1, pop: 6, "r&b": 0, "hip-hop": 0, rock: 0, jazz: 0 },
  { month: "2023-04", indie: 12, electronic: 1, pop: 6, "r&b": 0, "hip-hop": 4, rock: 0, jazz: 0 },
  { month: "2023-05", indie: 8, electronic: 0, pop: 6, "r&b": 2, "hip-hop": 2, rock: 0, jazz: 0 },
  { month: "2023-06", indie: 6, electronic: 0, pop: 5, "r&b": 2, "hip-hop": 0, rock: 2, jazz: 0 },
  { month: "2023-07", indie: 10, electronic: 6, pop: 4, "r&b": 3, "hip-hop": 0, rock: 1, jazz: 1 },
  { month: "2023-08", indie: 7, electronic: 1, pop: 4, "r&b": 3, "hip-hop": 0, rock: 1, jazz: 0 },
  { month: "2023-09", indie: 9, electronic: 1, pop: 9, "r&b": 1, "hip-hop": 0, rock: 3, jazz: 2 },
  { month: "2023-10", indie: 7, electronic: 1, pop: 10, "r&b": 0, "hip-hop": 0, rock: 0, jazz: 1 },
  { month: "2023-11", indie: 10, electronic: 2, pop: 17, "r&b": 2, "hip-hop": 1, rock: 3, jazz: 2 },
  { month: "2023-12", indie: 8, electronic: 1, pop: 10, "r&b": 1, "hip-hop": 1, rock: 2, jazz: 0 },
  { month: "2024-01", indie: 6, electronic: 0, pop: 3, "r&b": 4, "hip-hop": 1, rock: 4, jazz: 0 },
  { month: "2024-02", indie: 16, electronic: 4, pop: 14, "r&b": 3, "hip-hop": 5, rock: 7, jazz: 1 },
  { month: "2024-03", indie: 11, electronic: 3, pop: 11, "r&b": 5, "hip-hop": 3, rock: 1, jazz: 2 },
  { month: "2024-04", indie: 20, electronic: 1, pop: 7, "r&b": 3, "hip-hop": 0, rock: 3, jazz: 0 },
  { month: "2024-05", indie: 0, electronic: 1, pop: 5, "r&b": 2, "hip-hop": 0, rock: 1, jazz: 0 },
  { month: "2024-06", indie: 3, electronic: 3, pop: 12, "r&b": 4, "hip-hop": 0, rock: 0, jazz: 0 },
  { month: "2024-07", indie: 6, electronic: 2, pop: 10, "r&b": 0, "hip-hop": 1, rock: 1, jazz: 2 },
  { month: "2024-08", indie: 3, electronic: 0, pop: 1, "r&b": 1, "hip-hop": 0, rock: 1, jazz: 1 },
  { month: "2024-09", indie: 9, electronic: 1, pop: 7, "r&b": 2, "hip-hop": 2, rock: 0, jazz: 0 },
  { month: "2024-10", indie: 6, electronic: 1, pop: 4, "r&b": 1, "hip-hop": 0, rock: 1, jazz: 0 },
  { month: "2024-11", indie: 6, electronic: 0, pop: 9, "r&b": 4, "hip-hop": 2, rock: 2, jazz: 1 },
  { month: "2024-12", indie: 8, electronic: 2, pop: 8, "r&b": 1, "hip-hop": 2, rock: 0, jazz: 2 },
  { month: "2025-01", indie: 6, electronic: 1, pop: 0, "r&b": 0, "hip-hop": 1, rock: 0, jazz: 0 },
  { month: "2025-02", indie: 8, electronic: 2, pop: 5, "r&b": 2, "hip-hop": 0, rock: 1, jazz: 0 },
  { month: "2025-03", indie: 8, electronic: 1, pop: 4, "r&b": 0, "hip-hop": 1, rock: 0, jazz: 0 },
  { month: "2025-04", indie: 12, electronic: 0, pop: 2, "r&b": 0, "hip-hop": 0, rock: 1, jazz: 0 },
  { month: "2025-05", indie: 7, electronic: 1, pop: 1, "r&b": 0, "hip-hop": 0, rock: 0, jazz: 1 },
  { month: "2025-06", indie: 8, electronic: 1, pop: 4, "r&b": 0, "hip-hop": 0, rock: 2, jazz: 0 },
  { month: "2025-07", indie: 5, electronic: 3, pop: 3, "r&b": 1, "hip-hop": 0, rock: 0, jazz: 0 },
  { month: "2025-08", indie: 6, electronic: 1, pop: 12, "r&b": 1, "hip-hop": 0, rock: 0, jazz: 0 },
  { month: "2025-09", indie: 2, electronic: 2, pop: 8, "r&b": 0, "hip-hop": 0, rock: 1, jazz: 0 },
  { month: "2025-10", indie: 5, electronic: 2, pop: 3, "r&b": 0, "hip-hop": 0, rock: 2, jazz: 1 },
  { month: "2025-11", indie: 5, electronic: 0, pop: 5, "r&b": 0, "hip-hop": 2, rock: 1, jazz: 1 },
  { month: "2025-12", indie: 6, electronic: 1, pop: 2, "r&b": 2, "hip-hop": 0, rock: 2, jazz: 0 },
  { month: "2026-01", indie: 1, electronic: 4, pop: 3, "r&b": 0, "hip-hop": 0, rock: 0, jazz: 0 },
];

export default function GenreChart() {
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
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={streamgraphData}
            stackOffset="expand"
            margin={{ top: 10, right: 8, bottom: 0, left: -8 }}
          >
            <XAxis
              dataKey="month"
              tickFormatter={fm}
              tick={{ fill: C.textFaint, fontSize: 10, fontFamily: UI_FONT }}
              axisLine={{ stroke: C.border }}
              tickLine={false}
              interval={4}
            />
            <YAxis tick={false} axisLine={false} tickLine={false} />
            <Tooltip content={renderTooltip} />
            {Object.entries(C.genres).map(([g, col]) => (
              <Area
                key={g}
                type="monotone"
                dataKey={g}
                stackId="1"
                stroke="none"
                fill={col}
                fillOpacity={0.75}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
        <GenreLegend colors={C} />
        <Annotation colors={C} style={{ marginTop: 6 }}>
          Proportional genre share per month — height = % of that month's total, not absolute count
        </Annotation>
      </div>
    </div>
  );
}
