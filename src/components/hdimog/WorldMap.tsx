import { useState, useRef, useCallback } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { COUNTRIES_BY_NUMERIC } from "./hdimog-data";
import { flagEmoji, METRIC_META } from "./hdimog-utils";
import type { AccessStatus, MetricKey } from "./hdimog-types";
import type { HDIMogColors } from "./hdimog-utils";

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface TooltipState {
  x: number;
  y: number;
  name: string;
  flag: string;
  value: string | null;
  status: AccessStatus;
}

interface Props {
  accessMap: Record<string, AccessStatus>;
  metric: MetricKey;
  colors: HDIMogColors;
  onCountryClick?: (iso3: string) => void;
}

function geoFill(status: AccessStatus, C: HDIMogColors): string {
  switch (status) {
    case "accessible":   return C.accessible;
    case "inaccessible": return C.inaccessible;
    case "selected":     return C.selected;
    case "no-data":      return C.noData;
  }
}

function statusLabel(status: AccessStatus): string {
  switch (status) {
    case "accessible":   return "Accessible";
    case "inaccessible": return "Not accessible";
    case "selected":     return "Your passport";
    case "no-data":      return "No data";
  }
}

export default function WorldMap({ accessMap, metric, colors, onCountryClick }: Props) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const meta = METRIC_META[metric];

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (tooltip) {
      setTooltip((t) =>
        t ? { ...t, x: e.clientX - rect.left, y: e.clientY - rect.top } : null
      );
    }
  }, [tooltip]);

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", width: "100%", borderRadius: "8px", overflow: "hidden", background: colors.bg }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTooltip(null)}
    >
      <ComposableMap
        projectionConfig={{ scale: 147, center: [0, 14] }}
        style={{ width: "100%", height: "auto" }}
      >
        <ZoomableGroup zoom={1}>
          <Geographies geography={GEO_URL}>
            {({ geographies }: { geographies: any[] }) =>
              geographies.map((geo: any) => {
                const numericId = Number(geo.id);
                const country = COUNTRIES_BY_NUMERIC.get(numericId);
                const status: AccessStatus = country
                  ? (accessMap[country.iso3] ?? "no-data")
                  : "no-data";
                const fill = geoFill(status, colors);
                const val = country?.[metric];

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fill}
                    stroke={colors.bg}
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none" },
                      hover: { outline: "none", fill: status === "selected" ? colors.selected : colors.hover, cursor: "pointer" },
                      pressed: { outline: "none" },
                    }}
                    onMouseEnter={(e: React.MouseEvent) => {
                      if (!containerRef.current) return;
                      const rect = containerRef.current.getBoundingClientRect();
                      setTooltip({
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top,
                        name: country?.name ?? geo.properties?.name ?? "Unknown",
                        flag: country ? flagEmoji(country.iso2) : "",
                        value: val != null ? meta.format(val) : null,
                        status,
                      });
                    }}
                    onMouseLeave={() => setTooltip(null)}
                    onClick={() => {
                      if (country) onCountryClick?.(country.iso3);
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {tooltip && (
        <div
          style={{
            position: "absolute",
            left: tooltip.x + 12,
            top: tooltip.y - 10,
            background: colors.card,
            border: `1px solid ${colors.border}`,
            borderRadius: "6px",
            padding: "6px 10px",
            pointerEvents: "none",
            whiteSpace: "nowrap",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            zIndex: 10,
            fontFamily: "'Source Serif 4', Georgia, serif",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
            <span style={{ fontSize: "1rem" }}>{tooltip.flag}</span>
            <span style={{ fontWeight: 600, fontSize: "0.85rem", color: colors.text }}>
              {tooltip.name}
            </span>
          </div>
          <div style={{ fontSize: "0.75rem", color: colors.textLight }}>
            {tooltip.value != null
              ? `${meta.label}: ${tooltip.value}`
              : `${meta.label}: no data`}
          </div>
          <div
            style={{
              fontSize: "0.7rem",
              marginTop: "2px",
              color:
                tooltip.status === "accessible"
                  ? colors.accessible
                  : tooltip.status === "inaccessible"
                  ? colors.inaccessible
                  : tooltip.status === "selected"
                  ? colors.selected
                  : colors.textFaint,
              fontFamily: "'IBM Plex Mono', monospace",
            }}
          >
            {statusLabel(tooltip.status)}
          </div>
        </div>
      )}
    </div>
  );
}
