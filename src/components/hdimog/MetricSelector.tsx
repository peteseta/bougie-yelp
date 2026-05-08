import type { MetricKey } from "./hdimog-types";
import { METRIC_META } from "./hdimog-utils";
import type { HDIMogColors } from "./hdimog-utils";

interface Props {
  metric: MetricKey;
  onMetricChange: (m: MetricKey) => void;
  colors: HDIMogColors;
}

const METRICS: MetricKey[] = [
  "hdi",
  "gini",
  "gdpPerCapita",
  "lifeExpectancy",
  "co2PerCapita",
];

export default function MetricSelector({
  metric,
  onMetricChange,
  colors,
}: Props) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
      {METRICS.map((key) => {
        const active = key === metric;
        const meta = METRIC_META[key];
        return (
          <button
            key={key}
            onClick={() => onMetricChange(key)}
            title={meta.description}
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "0.72rem",
              fontWeight: active ? 600 : 400,
              padding: "11px 10px",
              borderRadius: "4px",
              border: `1px solid ${active ? colors.accent : colors.border}`,
              background: active ? colors.accent : "transparent",
              color: active ? colors.bg : colors.textLight,
              cursor: "pointer",
              letterSpacing: "0.01em",
              transition: "all 0.15s ease",
              whiteSpace: "nowrap",
            }}
          >
            {meta.label}
          </button>
        );
      })}
    </div>
  );
}
