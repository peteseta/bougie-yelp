import { useState, useMemo } from "react";
import { COUNTRIES } from "./hdimog-data";
import { flagEmoji, METRIC_META } from "./hdimog-utils";
import type { AccessStatus, MetricKey, SortKey } from "./hdimog-types";
import type { HDIMogColors } from "./hdimog-utils";

interface Props {
  accessMap: Record<string, AccessStatus>;
  metric: MetricKey;
  colors: HDIMogColors;
}

const ACCESS_ORDER: Record<AccessStatus, number> = {
  selected: 0,
  accessible: 1,
  inaccessible: 2,
  "no-data": 3,
};

export default function CountryList({ accessMap, metric, colors }: Props) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("access");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const meta = METRIC_META[metric];

  const rows = useMemo(() => {
    const q = search.toLowerCase().trim();
    let list = COUNTRIES.filter(
      (c) => !q || c.name.toLowerCase().includes(q) || c.iso3.toLowerCase().includes(q)
    );

    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (sortBy === "name") {
        cmp = a.name.localeCompare(b.name);
      } else if (sortBy === "metric") {
        const av = a[metric] ?? -Infinity;
        const bv = b[metric] ?? -Infinity;
        cmp = (av as number) - (bv as number);
      } else {
        const as = ACCESS_ORDER[accessMap[a.iso3] ?? "no-data"];
        const bs = ACCESS_ORDER[accessMap[b.iso3] ?? "no-data"];
        cmp = as - bs || a.name.localeCompare(b.name);
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return list;
  }, [search, sortBy, sortDir, metric, accessMap]);

  function handleSort(col: SortKey) {
    if (sortBy === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(col);
      setSortDir("asc");
    }
  }

  function SortIndicator({ col }: { col: SortKey }) {
    if (sortBy !== col) return <span style={{ color: colors.textFaint }}> ⇅</span>;
    return (
      <span style={{ color: colors.accent }}>
        {sortDir === "asc" ? " ↑" : " ↓"}
      </span>
    );
  }

  function StatusBadge({ status }: { status: AccessStatus }) {
    if (status === "selected") {
      return (
        <span
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "0.68rem",
            padding: "2px 7px",
            borderRadius: "3px",
            border: `1px solid ${colors.selected}66`,
            background: `${colors.selected}14`,
            color: colors.selected,
          }}
        >
          passport
        </span>
      );
    }
    if (status === "accessible") {
      return (
        <span
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "0.68rem",
            padding: "2px 7px",
            borderRadius: "3px",
            border: `1px solid ${colors.accessible}66`,
            background: `${colors.accessible}14`,
            color: colors.accessible,
          }}
        >
          yes
        </span>
      );
    }
    if (status === "inaccessible") {
      return (
        <span
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "0.68rem",
            padding: "2px 7px",
            borderRadius: "3px",
            border: `1px solid ${colors.inaccessible}66`,
            background: `${colors.inaccessible}14`,
            color: colors.inaccessible,
          }}
        >
          no
        </span>
      );
    }
    return (
      <span
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "0.68rem",
          padding: "2px 7px",
          borderRadius: "3px",
          border: `1px solid ${colors.textFaint}44`,
          background: "transparent",
          color: colors.textFaint,
        }}
      >
        —
      </span>
    );
  }

  const thStyle: React.CSSProperties = {
    padding: "8px 12px",
    textAlign: "left",
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: "0.72rem",
    fontWeight: 600,
    color: colors.textLight,
    borderBottom: `1px solid ${colors.border}`,
    cursor: "pointer",
    userSelect: "none",
    whiteSpace: "nowrap",
    background: colors.card,
  };

  return (
    <div>
      <div style={{ marginBottom: "12px" }}>
        <input
          type="text"
          placeholder="Search countries…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            maxWidth: "340px",
            padding: "7px 12px",
            border: `1px solid ${colors.border}`,
            borderRadius: "6px",
            background: colors.card,
            color: colors.text,
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "0.82rem",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
      </div>

      <div
        style={{
          border: `1px solid ${colors.border}`,
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.88rem",
              fontFamily: "'Source Serif 4', Georgia, serif",
            }}
          >
            <thead>
              <tr>
                <th style={{ ...thStyle, width: "36px" }}></th>
                <th style={thStyle} onClick={() => handleSort("name")}>
                  Country <SortIndicator col="name" />
                </th>
                <th style={{ ...thStyle, textAlign: "right" }} onClick={() => handleSort("metric")}>
                  {meta.label} <SortIndicator col="metric" />
                </th>
                <th style={{ ...thStyle, textAlign: "center" }} onClick={() => handleSort("access")}>
                  Access <SortIndicator col="access" />
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c, i) => {
                const status = accessMap[c.iso3] ?? "no-data";
                const val = c[metric];
                const isEven = i % 2 === 0;
                return (
                  <tr
                    key={c.iso3}
                    style={{
                      background: isEven ? "transparent" : `${colors.border}44`,
                    }}
                  >
                    <td style={{ padding: "7px 8px 7px 12px", textAlign: "center", fontSize: "1.1rem", lineHeight: 1 }}>
                      {flagEmoji(c.iso2)}
                    </td>
                    <td style={{ padding: "7px 12px", color: colors.text }}>
                      {c.name}
                    </td>
                    <td
                      style={{
                        padding: "7px 12px",
                        textAlign: "right",
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: "0.8rem",
                        color: val != null ? colors.text : colors.textFaint,
                      }}
                    >
                      {val != null ? meta.format(val) : "—"}
                    </td>
                    <td style={{ padding: "7px 12px", textAlign: "center" }}>
                      <StatusBadge status={status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div
        style={{
          marginTop: "8px",
          fontSize: "0.75rem",
          color: colors.textFaint,
          fontFamily: "'IBM Plex Mono', monospace",
        }}
      >
        {rows.length} countries
      </div>
    </div>
  );
}
