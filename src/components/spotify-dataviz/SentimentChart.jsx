import { useState, useEffect } from "react";
import {
  AreaChart, Area, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, ReferenceLine,
} from "recharts";
import { useTheme, useColors, FONT, UI_FONT, fm, ChartTooltip, Annotation } from "./spotify-utils.jsx";

const sentimentData = [
  { month: "2022-12", sentiment: 0.53, tracks: 34 },
  { month: "2023-01", sentiment: 0.73, tracks: 10 },
  { month: "2023-02", sentiment: 0.385, tracks: 13 },
  { month: "2023-03", sentiment: 0.517, tracks: 15 },
  { month: "2023-04", sentiment: 0.525, tracks: 23 },
  { month: "2023-05", sentiment: 0.588, tracks: 18 },
  { month: "2023-06", sentiment: 0.198, tracks: 15 },
  { month: "2023-07", sentiment: 0.437, tracks: 25 },
  { month: "2023-08", sentiment: 0.545, tracks: 16 },
  { month: "2023-09", sentiment: 0.423, tracks: 26 },
  { month: "2023-10", sentiment: 0.386, tracks: 19 },
  { month: "2023-11", sentiment: 0.63, tracks: 37 },
  { month: "2023-12", sentiment: 0.361, tracks: 23 },
  { month: "2024-01", sentiment: 0.504, tracks: 18 },
  { month: "2024-02", sentiment: 0.478, tracks: 50 },
  { month: "2024-03", sentiment: 0.622, tracks: 36 },
  { month: "2024-04", sentiment: 0.444, tracks: 34 },
  { month: "2024-05", sentiment: -0.132, tracks: 9 },
  { month: "2024-06", sentiment: 0.486, tracks: 22 },
  { month: "2024-07", sentiment: 0.145, tracks: 23 },
  { month: "2024-08", sentiment: 0.735, tracks: 7 },
  { month: "2024-09", sentiment: 0.526, tracks: 21 },
  { month: "2024-10", sentiment: 0.494, tracks: 13 },
  { month: "2024-11", sentiment: 0.363, tracks: 25 },
  { month: "2024-12", sentiment: 0.349, tracks: 23 },
  { month: "2025-01", sentiment: 0.432, tracks: 9 },
  { month: "2025-02", sentiment: 0.501, tracks: 18 },
  { month: "2025-03", sentiment: 0.578, tracks: 14 },
  { month: "2025-04", sentiment: 0.237, tracks: 15 },
  { month: "2025-05", sentiment: 0.782, tracks: 10 },
  { month: "2025-06", sentiment: 0.632, tracks: 15 },
  { month: "2025-07", sentiment: 0.361, tracks: 13 },
  { month: "2025-08", sentiment: 0.346, tracks: 21 },
  { month: "2025-09", sentiment: 0.174, tracks: 13 },
  { month: "2025-10", sentiment: 0.44, tracks: 14 },
  { month: "2025-11", sentiment: 0.507, tracks: 14 },
  { month: "2025-12", sentiment: 0.8, tracks: 13 },
  { month: "2026-01", sentiment: 0.46, tracks: 11 },
];

const lifeEvents = [
  { month: "2024-05", label: "Graduated HS", icon: "🎓" },
  { month: "2024-08", label: "Moved to YVR", icon: "✈️" },
  { month: "2024-09", label: "Started UBC", icon: "📚" },
  { month: "2025-02", label: "Trip home", icon: "🏠" },
  { month: "2025-05", label: "Summer in BKK", icon: "☀️" },
  { month: "2025-09", label: "Moved out", icon: "🏠" },
];

const lifeEventByMonth = Object.fromEntries(lifeEvents.map(ev => [ev.month, ev]));

export default function SentimentChart() {
  const [highlightedEvent, setHighlightedEvent] = useState(null);
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
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart
            data={sentimentData}
            margin={{ top: 16, right: 8, bottom: 0, left: -8 }}
            onMouseMove={(state) => {
              if (state?.activeLabel && lifeEventByMonth[state.activeLabel]) {
                setHighlightedEvent(state.activeLabel);
              } else {
                setHighlightedEvent(prev => (prev && lifeEventByMonth[prev] ? null : prev));
              }
            }}
            onMouseLeave={() => setHighlightedEvent(null)}
          >
            <defs>
              <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.textGhost} stopOpacity={0.5} />
                <stop offset="100%" stopColor={C.textGhost} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
            <XAxis
              dataKey="month"
              tickFormatter={fm}
              tick={{ fill: C.textFaint, fontSize: 10, fontFamily: UI_FONT }}
              axisLine={{ stroke: C.border }}
              tickLine={false}
              interval={3}
            />
            <YAxis
              yAxisId="t"
              orientation="left"
              tick={{ fill: C.textFaint, fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              domain={[0, 55]}
              label={{ value: "tracks", angle: -90, position: "insideLeft", style: { fontSize: 10, fill: C.textFaint } }}
            />
            <YAxis
              yAxisId="s"
              orientation="right"
              tick={{ fill: C.textFaint, fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              domain={[-0.2, 1]}
              label={{ value: "sentiment", angle: 90, position: "insideRight", style: { fontSize: 10, fill: C.textFaint } }}
            />
            <Tooltip content={renderTooltip} />
            <Area
              yAxisId="t"
              type="monotone"
              dataKey="tracks"
              stroke={C.textGhost}
              fill="url(#tg)"
              strokeWidth={1.5}
              name="tracks"
            />
            <Line
              yAxisId="s"
              type="monotone"
              dataKey="sentiment"
              stroke={C.accent}
              strokeWidth={2}
              dot={false}
              name="sentiment"
            />
            {highlightedEvent && (
              <ReferenceLine
                x={highlightedEvent}
                yAxisId="t"
                stroke={C.accent}
                strokeDasharray="4 3"
                strokeWidth={1.5}
                label={{
                  value: lifeEventByMonth[highlightedEvent]?.icon + " " + lifeEventByMonth[highlightedEvent]?.label,
                  position: "top",
                  fill: C.accent,
                  fontSize: 10,
                  fontFamily: UI_FONT,
                }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
        <Annotation colors={C}>
          In the back, monthly "favorites" count. In the front, average lyrical sentiment (VADER score, -1 to 1)
        </Annotation>
      </div>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 16 }}>
        {lifeEvents.map((ev, i) => {
          const isHighlighted = highlightedEvent === ev.month;
          return (
            <span
              key={i}
              onMouseEnter={() => setHighlightedEvent(ev.month)}
              onMouseLeave={() => setHighlightedEvent(null)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 20,
                background: isHighlighted ? C.accentSoft : C.card,
                border: `1px solid ${isHighlighted ? C.accent : C.border}`,
                borderRadius: 6,
                padding: "4px 10px",
                fontSize: 11,
                color: isHighlighted ? C.accent : C.textLight,
                fontFamily: FONT,
                cursor: "default",
                transition: "all 0.2s ease",
              }}
            >
              {ev.icon} {ev.label}{" "}
              <span style={{ color: isHighlighted ? C.accent : C.textFaint, fontFamily: FONT, fontSize: 10 }}>
                {fm(ev.month)}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
