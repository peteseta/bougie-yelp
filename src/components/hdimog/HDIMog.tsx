import { useState, useEffect, useMemo } from "react";
import { useTheme, useHDIMogColors, computeAccessMap, countAccess, METRIC_META } from "./hdimog-utils";
import { COUNTRIES_BY_ISO3 } from "./hdimog-data";
import PassportSelector from "./PassportSelector";
import MetricSelector from "./MetricSelector";
import WorldMap from "./WorldMap";
import CountryList from "./CountryList";
import type { MetricKey } from "./hdimog-types";

export default function HDIMog() {
  const [mounted, setMounted] = useState(false);
  const [passport, setPassport] = useState<string>("USA");
  const [metric, setMetric] = useState<MetricKey>("hdi");

  useEffect(() => setMounted(true), []);

  const dark = useTheme();
  const colors = useHDIMogColors(dark);

  const accessMap = useMemo(
    () => computeAccessMap(passport, metric),
    [passport, metric]
  );

  const stats = useMemo(() => countAccess(accessMap), [accessMap]);
  const passportCountry = COUNTRIES_BY_ISO3.get(passport);
  const passportValue = passportCountry?.[metric];
  const meta = METRIC_META[metric];

  if (!mounted) {
    return (
      <div style={{ minHeight: "600px", opacity: 0 }} />
    );
  }

  return (
    <div style={{ color: colors.text, fontFamily: "'Source Serif 4', Georgia, serif" }}>
      {/* Controls row */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          alignItems: "flex-start",
          marginBottom: "16px",
        }}
      >
        <PassportSelector
          passport={passport}
          onPassportChange={setPassport}
          colors={colors}
        />
        <MetricSelector
          metric={metric}
          onMetricChange={setMetric}
          colors={colors}
        />
      </div>

      {/* Stat bar */}
      {passportCountry && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            marginBottom: "12px",
            padding: "10px 14px",
            background: colors.card,
            border: `1px solid ${colors.border}`,
            borderRadius: "8px",
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "0.78rem",
          }}
        >
          <span style={{ color: colors.textLight }}>
            passport:{" "}
            <span style={{ color: colors.selected, fontWeight: 600 }}>
              {passportCountry.name}
            </span>
          </span>
          <span style={{ color: colors.textLight }}>
            {meta.label}:{" "}
            <span style={{ color: colors.text, fontWeight: 600 }}>
              {passportValue != null ? meta.format(passportValue) : "no data"}
            </span>
          </span>
          <span style={{ color: colors.accessible }}>
            accessible: <strong>{stats.accessible}</strong>
          </span>
          <span style={{ color: colors.inaccessible }}>
            not accessible: <strong>{stats.inaccessible}</strong>
          </span>
          {stats.noData > 0 && (
            <span style={{ color: colors.textFaint }}>
              no data: {stats.noData}
            </span>
          )}
        </div>
      )}

      {/* Map */}
      <div style={{ marginBottom: "24px" }}>
        <WorldMap
          accessMap={accessMap}
          metric={metric}
          colors={colors}
          onCountryClick={setPassport}
        />
      </div>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "20px",
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "0.72rem",
          color: colors.textLight,
        }}
      >
        {[
          { color: colors.accessible,   label: "accessible" },
          { color: colors.inaccessible, label: "not accessible" },
          { color: colors.selected,     label: "your passport" },
          { color: colors.noData,       label: "no data" },
        ].map(({ color, label }) => (
          <span key={label} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <span
              style={{
                display: "inline-block",
                width: "12px",
                height: "12px",
                borderRadius: "2px",
                background: color,
                flexShrink: 0,
              }}
            />
            {label}
          </span>
        ))}
        <span style={{ marginLeft: "auto", color: colors.textFaint }}>
          click a country on the map to switch passport
        </span>
      </div>

      {/* Metric description */}
      <div
        style={{
          marginBottom: "20px",
          padding: "8px 12px",
          borderLeft: `3px solid ${colors.accent}44`,
          color: colors.textLight,
          fontSize: "0.82rem",
          fontStyle: "italic",
        }}
      >
        {meta.description}.{" "}
        {meta.higherIsBetter
          ? `Countries with a lower ${meta.label} than yours are marked accessible.`
          : `Countries with a higher ${meta.label} than yours are marked accessible.`}
      </div>

      {/* Country list */}
      <CountryList
        accessMap={accessMap}
        metric={metric}
        colors={colors}
      />
    </div>
  );
}
