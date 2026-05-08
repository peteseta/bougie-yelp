import { useState, useEffect } from "react";
import type { MetricKey, MetricMeta, AccessStatus } from "./hdimog-types";
import { COUNTRIES, COUNTRIES_BY_ISO3 } from "./hdimog-data";

export function useTheme(): boolean {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const html = document.documentElement;
    const update = () => setDark(html.getAttribute("data-theme") === "dark");
    update();
    const observer = new MutationObserver(update);
    observer.observe(html, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);
  return dark;
}

export interface HDIMogColors {
  accessible: string;
  inaccessible: string;
  selected: string;
  noData: string;
  hover: string;
  card: string;
  border: string;
  text: string;
  textLight: string;
  textFaint: string;
  accent: string;
  bg: string;
}

export function useHDIMogColors(dark: boolean): HDIMogColors {
  if (dark) {
    return {
      accessible: "#6AAE78",
      inaccessible: "#8C4A4A",
      selected: "#D9A84A",
      noData: "#3D3832",
      hover: "#D9654A",
      card: "#2A2622",
      border: "#3D3832",
      text: "#E8E4DF",
      textLight: "#B0A99E",
      textFaint: "#7A7368",
      accent: "#D9654A",
      bg: "#212121",
    };
  }
  return {
    accessible: "#4A8C5C",
    inaccessible: "#C44D2B",
    selected: "#C49030",
    noData: "#D4D4CE",
    hover: "#006CAC",
    card: "#F5F5F5",
    border: "#E0E0DC",
    text: "#282728",
    textLight: "#6B6B68",
    textFaint: "#9A9A96",
    accent: "#006CAC",
    bg: "#FBFEFB",
  };
}

export const METRIC_META: Record<MetricKey, MetricMeta> = {
  hdi: {
    label: "HDI",
    description: "Human Development Index — composite of health, education, income (0–1, higher = better)",
    higherIsBetter: true,
    format: (v) => v.toFixed(3),
  },
  gini: {
    label: "Gini",
    description: "Gini coefficient — income inequality (0–100, lower = more equal)",
    higherIsBetter: false,
    format: (v) => v.toFixed(1),
  },
  gdpPerCapita: {
    label: "GDP/capita",
    description: "GDP per capita, PPP (current international $)",
    higherIsBetter: true,
    format: (v) =>
      v >= 1000 ? `$${Math.round(v / 1000)}k` : `$${Math.round(v)}`,
  },
  lifeExpectancy: {
    label: "Life exp.",
    description: "Life expectancy at birth (years)",
    higherIsBetter: true,
    format: (v) => `${v.toFixed(1)}yr`,
  },
  co2PerCapita: {
    label: "CO₂/capita",
    description: "CO₂ emissions per capita (tonnes, lower = cleaner)",
    higherIsBetter: false,
    format: (v) => `${v.toFixed(1)}t`,
  },
};

export function flagEmoji(iso2: string): string {
  return iso2
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join("");
}

export function computeAccessMap(
  passportIso3: string,
  metric: MetricKey
): Record<string, AccessStatus> {
  const passport = COUNTRIES_BY_ISO3.get(passportIso3);
  const passportValue = passport?.[metric] ?? null;
  const meta = METRIC_META[metric];
  const result: Record<string, AccessStatus> = {};

  for (const country of COUNTRIES) {
    if (country.iso3 === passportIso3) {
      result[country.iso3] = "selected";
      continue;
    }
    const val = country[metric];
    if (passportValue === null || val === null) {
      result[country.iso3] = "no-data";
      continue;
    }
    // higherIsBetter=true: accessible if target <= passport (they are less developed)
    // higherIsBetter=false (Gini, CO2): accessible if target >= passport (they are less equal/clean)
    const accessible = meta.higherIsBetter
      ? val <= passportValue
      : val >= passportValue;
    result[country.iso3] = accessible ? "accessible" : "inaccessible";
  }
  return result;
}

export function countAccess(accessMap: Record<string, AccessStatus>) {
  let accessible = 0;
  let inaccessible = 0;
  let noData = 0;
  for (const status of Object.values(accessMap)) {
    if (status === "accessible") accessible++;
    else if (status === "inaccessible") inaccessible++;
    else if (status === "no-data") noData++;
  }
  return { accessible, inaccessible, noData };
}
