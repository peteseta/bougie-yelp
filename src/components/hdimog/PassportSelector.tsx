import { useState, useRef, useEffect } from "react";
import { COUNTRIES } from "./hdimog-data";
import { flagEmoji } from "./hdimog-utils";
import type { HDIMogColors } from "./hdimog-utils";

interface Props {
  passport: string;
  onPassportChange: (iso3: string) => void;
  colors: HDIMogColors;
}

export default function PassportSelector({ passport, onPassportChange, colors }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = COUNTRIES.find((c) => c.iso3 === passport);

  const filtered =
    query.length < 1
      ? COUNTRIES
      : COUNTRIES.filter((c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.iso3.toLowerCase().includes(query.toLowerCase())
        );

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      setQuery("");
    }
  }, [open]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") setOpen(false);
    if (e.key === "Enter" && filtered.length > 0) {
      onPassportChange(filtered[0].iso3);
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} style={{ position: "relative", minWidth: "220px", maxWidth: "300px", flex: 1 }}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 12px",
          background: colors.card,
          border: `1px solid ${open ? colors.accent : colors.border}`,
          borderRadius: "6px",
          color: colors.text,
          cursor: "pointer",
          fontFamily: "'Source Serif 4', Georgia, serif",
          fontSize: "0.95rem",
          textAlign: "left",
          transition: "border-color 0.15s ease",
        }}
      >
        {selected ? (
          <>
            <span style={{ fontSize: "1.2rem", lineHeight: 1 }}>{flagEmoji(selected.iso2)}</span>
            <span style={{ flex: 1 }}>{selected.name}</span>
          </>
        ) : (
          <span style={{ color: colors.textFaint }}>Select passport…</span>
        )}
        <span style={{ color: colors.textFaint, fontSize: "0.7rem", marginLeft: "auto" }}>▾</span>
      </button>

      {open && (
        <div
          role="listbox"
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            background: colors.card,
            border: `1px solid ${colors.border}`,
            borderRadius: "6px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
            zIndex: 100,
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "8px 8px 4px" }}>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search country…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                width: "100%",
                padding: "6px 10px",
                border: `1px solid ${colors.border}`,
                borderRadius: "4px",
                background: colors.bg,
                color: colors.text,
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "0.8rem",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
          <ul
            style={{
              maxHeight: "260px",
              overflowY: "auto",
              margin: 0,
              padding: "4px 0",
              listStyle: "none",
            }}
          >
            {filtered.length === 0 ? (
              <li style={{ padding: "10px 14px", color: colors.textFaint, fontSize: "0.85rem" }}>
                No results
              </li>
            ) : (
              filtered.map((c) => (
                <li
                  key={c.iso3}
                  role="option"
                  aria-selected={c.iso3 === passport}
                  onClick={() => {
                    onPassportChange(c.iso3);
                    setOpen(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "7px 14px",
                    cursor: "pointer",
                    background:
                      c.iso3 === passport
                        ? `${colors.accent}22`
                        : "transparent",
                    color: c.iso3 === passport ? colors.accent : colors.text,
                    fontSize: "0.88rem",
                    fontFamily: "'Source Serif 4', Georgia, serif",
                  }}
                  onMouseEnter={(e) => {
                    if (c.iso3 !== passport)
                      (e.currentTarget as HTMLElement).style.background =
                        `${colors.border}88`;
                  }}
                  onMouseLeave={(e) => {
                    if (c.iso3 !== passport)
                      (e.currentTarget as HTMLElement).style.background =
                        "transparent";
                  }}
                >
                  <span style={{ fontSize: "1.1rem", lineHeight: 1 }}>{flagEmoji(c.iso2)}</span>
                  <span>{c.name}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
