export interface CountryData {
  iso3: string;
  iso3Numeric: number;
  iso2: string;
  name: string;
  hdi: number | null;
  gini: number | null;
  gdpPerCapita: number | null;
  lifeExpectancy: number | null;
  co2PerCapita: number | null;
}

export type MetricKey =
  | "hdi"
  | "gini"
  | "gdpPerCapita"
  | "lifeExpectancy"
  | "co2PerCapita";

export type AccessStatus =
  | "accessible"
  | "inaccessible"
  | "no-data"
  | "selected";

export type SortKey = "name" | "metric" | "access";

export interface MetricMeta {
  label: string;
  description: string;
  higherIsBetter: boolean;
  format: (v: number) => string;
}
