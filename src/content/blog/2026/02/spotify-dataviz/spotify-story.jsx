import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

/* ═══════════════════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════════════════ */

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

const streamgraphData = [
  {
    month: "2022-12",
    indie: 25,
    electronic: 1,
    pop: 6,
    "r&b": 0,
    "hip-hop": 2,
    rock: 0,
    jazz: 0,
  },
  {
    month: "2023-01",
    indie: 1,
    electronic: 1,
    pop: 7,
    "r&b": 0,
    "hip-hop": 1,
    rock: 0,
    jazz: 0,
  },
  {
    month: "2023-02",
    indie: 9,
    electronic: 0,
    pop: 2,
    "r&b": 1,
    "hip-hop": 1,
    rock: 0,
    jazz: 0,
  },
  {
    month: "2023-03",
    indie: 6,
    electronic: 1,
    pop: 6,
    "r&b": 0,
    "hip-hop": 0,
    rock: 0,
    jazz: 0,
  },
  {
    month: "2023-04",
    indie: 12,
    electronic: 1,
    pop: 6,
    "r&b": 0,
    "hip-hop": 4,
    rock: 0,
    jazz: 0,
  },
  {
    month: "2023-05",
    indie: 8,
    electronic: 0,
    pop: 6,
    "r&b": 2,
    "hip-hop": 2,
    rock: 0,
    jazz: 0,
  },
  {
    month: "2023-06",
    indie: 6,
    electronic: 0,
    pop: 5,
    "r&b": 2,
    "hip-hop": 0,
    rock: 2,
    jazz: 0,
  },
  {
    month: "2023-07",
    indie: 10,
    electronic: 6,
    pop: 4,
    "r&b": 3,
    "hip-hop": 0,
    rock: 1,
    jazz: 1,
  },
  {
    month: "2023-08",
    indie: 7,
    electronic: 1,
    pop: 4,
    "r&b": 3,
    "hip-hop": 0,
    rock: 1,
    jazz: 0,
  },
  {
    month: "2023-09",
    indie: 9,
    electronic: 1,
    pop: 9,
    "r&b": 1,
    "hip-hop": 0,
    rock: 3,
    jazz: 2,
  },
  {
    month: "2023-10",
    indie: 7,
    electronic: 1,
    pop: 10,
    "r&b": 0,
    "hip-hop": 0,
    rock: 0,
    jazz: 1,
  },
  {
    month: "2023-11",
    indie: 10,
    electronic: 2,
    pop: 17,
    "r&b": 2,
    "hip-hop": 1,
    rock: 3,
    jazz: 2,
  },
  {
    month: "2023-12",
    indie: 8,
    electronic: 1,
    pop: 10,
    "r&b": 1,
    "hip-hop": 1,
    rock: 2,
    jazz: 0,
  },
  {
    month: "2024-01",
    indie: 6,
    electronic: 0,
    pop: 3,
    "r&b": 4,
    "hip-hop": 1,
    rock: 4,
    jazz: 0,
  },
  {
    month: "2024-02",
    indie: 16,
    electronic: 4,
    pop: 14,
    "r&b": 3,
    "hip-hop": 5,
    rock: 7,
    jazz: 1,
  },
  {
    month: "2024-03",
    indie: 11,
    electronic: 3,
    pop: 11,
    "r&b": 5,
    "hip-hop": 3,
    rock: 1,
    jazz: 2,
  },
  {
    month: "2024-04",
    indie: 20,
    electronic: 1,
    pop: 7,
    "r&b": 3,
    "hip-hop": 0,
    rock: 3,
    jazz: 0,
  },
  {
    month: "2024-05",
    indie: 0,
    electronic: 1,
    pop: 5,
    "r&b": 2,
    "hip-hop": 0,
    rock: 1,
    jazz: 0,
  },
  {
    month: "2024-06",
    indie: 3,
    electronic: 3,
    pop: 12,
    "r&b": 4,
    "hip-hop": 0,
    rock: 0,
    jazz: 0,
  },
  {
    month: "2024-07",
    indie: 6,
    electronic: 2,
    pop: 10,
    "r&b": 0,
    "hip-hop": 1,
    rock: 1,
    jazz: 2,
  },
  {
    month: "2024-08",
    indie: 3,
    electronic: 0,
    pop: 1,
    "r&b": 1,
    "hip-hop": 0,
    rock: 1,
    jazz: 1,
  },
  {
    month: "2024-09",
    indie: 9,
    electronic: 1,
    pop: 7,
    "r&b": 2,
    "hip-hop": 2,
    rock: 0,
    jazz: 0,
  },
  {
    month: "2024-10",
    indie: 6,
    electronic: 1,
    pop: 4,
    "r&b": 1,
    "hip-hop": 0,
    rock: 1,
    jazz: 0,
  },
  {
    month: "2024-11",
    indie: 6,
    electronic: 0,
    pop: 9,
    "r&b": 4,
    "hip-hop": 2,
    rock: 2,
    jazz: 1,
  },
  {
    month: "2024-12",
    indie: 8,
    electronic: 2,
    pop: 8,
    "r&b": 1,
    "hip-hop": 2,
    rock: 0,
    jazz: 2,
  },
  {
    month: "2025-01",
    indie: 6,
    electronic: 1,
    pop: 0,
    "r&b": 0,
    "hip-hop": 1,
    rock: 0,
    jazz: 0,
  },
  {
    month: "2025-02",
    indie: 8,
    electronic: 2,
    pop: 5,
    "r&b": 2,
    "hip-hop": 0,
    rock: 1,
    jazz: 0,
  },
  {
    month: "2025-03",
    indie: 8,
    electronic: 1,
    pop: 4,
    "r&b": 0,
    "hip-hop": 1,
    rock: 0,
    jazz: 0,
  },
  {
    month: "2025-04",
    indie: 12,
    electronic: 0,
    pop: 2,
    "r&b": 0,
    "hip-hop": 0,
    rock: 1,
    jazz: 0,
  },
  {
    month: "2025-05",
    indie: 7,
    electronic: 1,
    pop: 1,
    "r&b": 0,
    "hip-hop": 0,
    rock: 0,
    jazz: 1,
  },
  {
    month: "2025-06",
    indie: 8,
    electronic: 1,
    pop: 4,
    "r&b": 0,
    "hip-hop": 0,
    rock: 2,
    jazz: 0,
  },
  {
    month: "2025-07",
    indie: 5,
    electronic: 3,
    pop: 3,
    "r&b": 1,
    "hip-hop": 0,
    rock: 0,
    jazz: 0,
  },
  {
    month: "2025-08",
    indie: 6,
    electronic: 1,
    pop: 12,
    "r&b": 1,
    "hip-hop": 0,
    rock: 0,
    jazz: 0,
  },
  {
    month: "2025-09",
    indie: 2,
    electronic: 2,
    pop: 8,
    "r&b": 0,
    "hip-hop": 0,
    rock: 1,
    jazz: 0,
  },
  {
    month: "2025-10",
    indie: 5,
    electronic: 2,
    pop: 3,
    "r&b": 0,
    "hip-hop": 0,
    rock: 2,
    jazz: 1,
  },
  {
    month: "2025-11",
    indie: 5,
    electronic: 0,
    pop: 5,
    "r&b": 0,
    "hip-hop": 2,
    rock: 1,
    jazz: 1,
  },
  {
    month: "2025-12",
    indie: 6,
    electronic: 1,
    pop: 2,
    "r&b": 2,
    "hip-hop": 0,
    rock: 2,
    jazz: 0,
  },
  {
    month: "2026-01",
    indie: 1,
    electronic: 4,
    pop: 3,
    "r&b": 0,
    "hip-hop": 0,
    rock: 0,
    jazz: 0,
  },
];

const themeData = [
  {
    month: "2022-12",
    love: 20,
    heartbreak: 10,
    empowerment: 6,
    escapism: 3,
    nostalgia: 7,
  },
  {
    month: "2023-01",
    love: 7,
    heartbreak: 1,
    empowerment: 0,
    escapism: 0,
    nostalgia: 1,
  },
  {
    month: "2023-02",
    love: 6,
    heartbreak: 1,
    empowerment: 1,
    escapism: 1,
    nostalgia: 4,
  },
  {
    month: "2023-03",
    love: 10,
    heartbreak: 5,
    empowerment: 1,
    escapism: 1,
    nostalgia: 1,
  },
  {
    month: "2023-04",
    love: 13,
    heartbreak: 8,
    empowerment: 0,
    escapism: 3,
    nostalgia: 3,
  },
  {
    month: "2023-05",
    love: 9,
    heartbreak: 3,
    empowerment: 0,
    escapism: 4,
    nostalgia: 2,
  },
  {
    month: "2023-06",
    love: 4,
    heartbreak: 0,
    empowerment: 0,
    escapism: 1,
    nostalgia: 1,
  },
  {
    month: "2023-07",
    love: 12,
    heartbreak: 2,
    empowerment: 3,
    escapism: 3,
    nostalgia: 2,
  },
  {
    month: "2023-08",
    love: 9,
    heartbreak: 0,
    empowerment: 1,
    escapism: 3,
    nostalgia: 5,
  },
  {
    month: "2023-09",
    love: 16,
    heartbreak: 6,
    empowerment: 3,
    escapism: 5,
    nostalgia: 3,
  },
  {
    month: "2023-10",
    love: 10,
    heartbreak: 3,
    empowerment: 1,
    escapism: 1,
    nostalgia: 2,
  },
  {
    month: "2023-11",
    love: 19,
    heartbreak: 8,
    empowerment: 5,
    escapism: 8,
    nostalgia: 6,
  },
  {
    month: "2023-12",
    love: 16,
    heartbreak: 9,
    empowerment: 4,
    escapism: 4,
    nostalgia: 1,
  },
  {
    month: "2024-01",
    love: 13,
    heartbreak: 6,
    empowerment: 2,
    escapism: 4,
    nostalgia: 2,
  },
  {
    month: "2024-02",
    love: 32,
    heartbreak: 15,
    empowerment: 3,
    escapism: 4,
    nostalgia: 8,
  },
  {
    month: "2024-03",
    love: 24,
    heartbreak: 12,
    empowerment: 4,
    escapism: 2,
    nostalgia: 2,
  },
  {
    month: "2024-04",
    love: 20,
    heartbreak: 7,
    empowerment: 6,
    escapism: 6,
    nostalgia: 0,
  },
  {
    month: "2024-05",
    love: 6,
    heartbreak: 5,
    empowerment: 0,
    escapism: 0,
    nostalgia: 0,
  },
  {
    month: "2024-06",
    love: 14,
    heartbreak: 5,
    empowerment: 0,
    escapism: 3,
    nostalgia: 3,
  },
  {
    month: "2024-07",
    love: 14,
    heartbreak: 5,
    empowerment: 2,
    escapism: 2,
    nostalgia: 1,
  },
  {
    month: "2024-08",
    love: 3,
    heartbreak: 3,
    empowerment: 1,
    escapism: 1,
    nostalgia: 1,
  },
  {
    month: "2024-09",
    love: 13,
    heartbreak: 2,
    empowerment: 1,
    escapism: 4,
    nostalgia: 3,
  },
  {
    month: "2024-10",
    love: 12,
    heartbreak: 3,
    empowerment: 3,
    escapism: 3,
    nostalgia: 1,
  },
  {
    month: "2024-11",
    love: 14,
    heartbreak: 10,
    empowerment: 3,
    escapism: 1,
    nostalgia: 3,
  },
  {
    month: "2024-12",
    love: 9,
    heartbreak: 7,
    empowerment: 1,
    escapism: 3,
    nostalgia: 1,
  },
  {
    month: "2025-01",
    love: 5,
    heartbreak: 2,
    empowerment: 2,
    escapism: 1,
    nostalgia: 1,
  },
  {
    month: "2025-02",
    love: 13,
    heartbreak: 6,
    empowerment: 3,
    escapism: 2,
    nostalgia: 1,
  },
  {
    month: "2025-03",
    love: 10,
    heartbreak: 3,
    empowerment: 0,
    escapism: 1,
    nostalgia: 4,
  },
  {
    month: "2025-04",
    love: 8,
    heartbreak: 0,
    empowerment: 1,
    escapism: 1,
    nostalgia: 2,
  },
  {
    month: "2025-05",
    love: 5,
    heartbreak: 2,
    empowerment: 2,
    escapism: 0,
    nostalgia: 0,
  },
  {
    month: "2025-06",
    love: 9,
    heartbreak: 4,
    empowerment: 1,
    escapism: 1,
    nostalgia: 4,
  },
  {
    month: "2025-07",
    love: 8,
    heartbreak: 5,
    empowerment: 1,
    escapism: 1,
    nostalgia: 1,
  },
  {
    month: "2025-08",
    love: 15,
    heartbreak: 10,
    empowerment: 6,
    escapism: 2,
    nostalgia: 6,
  },
  {
    month: "2025-09",
    love: 7,
    heartbreak: 5,
    empowerment: 2,
    escapism: 1,
    nostalgia: 3,
  },
  {
    month: "2025-10",
    love: 8,
    heartbreak: 4,
    empowerment: 1,
    escapism: 1,
    nostalgia: 0,
  },
  {
    month: "2025-11",
    love: 10,
    heartbreak: 6,
    empowerment: 2,
    escapism: 0,
    nostalgia: 2,
  },
  {
    month: "2025-12",
    love: 9,
    heartbreak: 4,
    empowerment: 3,
    escapism: 5,
    nostalgia: 3,
  },
  {
    month: "2026-01",
    love: 2,
    heartbreak: 2,
    empowerment: 1,
    escapism: 1,
    nostalgia: 1,
  },
];

const artistTimeline = [
  {
    artist: "Charli xcx",
    total: 25,
    color: "#D94F7A",
    appearances: [
      { m: "2023-02", c: 1 },
      { m: "2023-06", c: 1 },
      { m: "2024-03", c: 1 },
      { m: "2024-06", c: 9 },
      { m: "2024-07", c: 4 },
      { m: "2024-09", c: 1 },
      { m: "2024-10", c: 2 },
      { m: "2024-11", c: 1 },
      { m: "2024-12", c: 2 },
      { m: "2025-03", c: 2 },
      { m: "2025-12", c: 1 },
    ],
  },
  {
    artist: "Sabrina Carpenter",
    total: 25,
    color: "#C9884A",
    appearances: [
      { m: "2023-01", c: 1 },
      { m: "2023-04", c: 3 },
      { m: "2023-05", c: 1 },
      { m: "2023-07", c: 1 },
      { m: "2023-12", c: 1 },
      { m: "2024-04", c: 1 },
      { m: "2024-06", c: 1 },
      { m: "2024-08", c: 1 },
      { m: "2024-09", c: 2 },
      { m: "2024-10", c: 1 },
      { m: "2024-11", c: 3 },
      { m: "2025-02", c: 2 },
      { m: "2025-08", c: 5 },
      { m: "2025-10", c: 1 },
      { m: "2025-12", c: 1 },
    ],
  },
  {
    artist: "Taylor Swift",
    total: 21,
    color: "#7A8FBB",
    appearances: [
      { m: "2022-12", c: 1 },
      { m: "2023-03", c: 1 },
      { m: "2023-04", c: 1 },
      { m: "2023-05", c: 1 },
      { m: "2023-09", c: 1 },
      { m: "2023-10", c: 1 },
      { m: "2023-11", c: 9 },
      { m: "2023-12", c: 4 },
      { m: "2024-01", c: 1 },
      { m: "2024-04", c: 1 },
    ],
  },
  {
    artist: "beabadoobee",
    total: 18,
    color: "#6A9E5E",
    appearances: [
      { m: "2022-12", c: 1 },
      { m: "2023-02", c: 1 },
      { m: "2023-07", c: 1 },
      { m: "2023-10", c: 3 },
      { m: "2024-08", c: 1 },
      { m: "2024-09", c: 2 },
      { m: "2024-11", c: 2 },
      { m: "2025-01", c: 1 },
      { m: "2025-04", c: 3 },
      { m: "2025-08", c: 1 },
      { m: "2025-09", c: 1 },
      { m: "2025-10", c: 1 },
    ],
  },
  {
    artist: "Olivia Rodrigo",
    total: 14,
    color: "#BB6E99",
    appearances: [
      { m: "2023-06", c: 1 },
      { m: "2023-08", c: 1 },
      { m: "2023-09", c: 7 },
      { m: "2023-11", c: 1 },
      { m: "2024-03", c: 3 },
      { m: "2025-08", c: 1 },
    ],
  },
  {
    artist: "Troye Sivan",
    total: 14,
    color: "#8A7ABB",
    appearances: [
      { m: "2023-09", c: 1 },
      { m: "2023-10", c: 5 },
      { m: "2023-11", c: 2 },
      { m: "2024-06", c: 1 },
      { m: "2024-07", c: 1 },
      { m: "2024-10", c: 1 },
      { m: "2024-11", c: 2 },
      { m: "2025-11", c: 1 },
    ],
  },
  {
    artist: "Lizzy McAlpine",
    total: 15,
    color: "#5EA0A0",
    appearances: [
      { m: "2022-12", c: 2 },
      { m: "2023-02", c: 1 },
      { m: "2023-03", c: 2 },
      { m: "2023-04", c: 3 },
      { m: "2024-02", c: 1 },
      { m: "2024-04", c: 1 },
      { m: "2024-09", c: 1 },
      { m: "2025-02", c: 1 },
      { m: "2025-04", c: 2 },
      { m: "2025-12", c: 1 },
    ],
  },
  {
    artist: "The 1975",
    total: 14,
    color: "#A09070",
    appearances: [
      { m: "2022-12", c: 1 },
      { m: "2023-01", c: 1 },
      { m: "2023-02", c: 1 },
      { m: "2023-03", c: 2 },
      { m: "2023-07", c: 2 },
      { m: "2023-09", c: 1 },
      { m: "2024-02", c: 4 },
      { m: "2024-07", c: 1 },
      { m: "2025-05", c: 1 },
    ],
  },
];

const lifeEvents = [
  { month: "2024-05", label: "Graduated HS", icon: "🎓" },
  { month: "2024-08", label: "Moved to YVR", icon: "✈️" },
  { month: "2024-09", label: "Started UBC", icon: "📚" },
  { month: "2025-02", label: "Trip home", icon: "🏠" },
  { month: "2025-05", label: "Summer in BKK", icon: "☀️" },
  { month: "2025-09", label: "Moved out", icon: "🏠" },
];

const homeTrips = [
  { month: "Feb '25", sentiment: 0.501, label: "Quick trip home" },
  { month: "May '25", sentiment: 0.782, label: "Summer at home" },
  { month: "Dec '25", sentiment: 0.8, label: "NYE in Bangkok" },
];

/* ═══════════════════════════════════════════════════════════════════════════
   THEME HOOK — reads the blog's data-theme attribute on <html>
   ═══════════════════════════════════════════════════════════════════════════ */

function useTheme() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    const update = () => setDark(html.getAttribute("data-theme") === "dark");
    update();

    const observer = new MutationObserver(update);
    observer.observe(html, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  return dark;
}

/* ═══════════════════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════════════════ */

const allMonths = sentimentData.map((d) => d.month);
const monthIdx = Object.fromEntries(allMonths.map((m, i) => [m, i]));
const lifeEventByMonth = Object.fromEntries(
  lifeEvents.map((ev) => [ev.month, ev]),
);

function fm(m) {
  if (!m) return "";
  const [y, mo] = m.split("-");
  const n = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${n[+mo]} '${y.slice(2)}`;
}

/* ═══════════════════════════════════════════════════════════════════════════
   COLOR SYSTEM — original editorial palette with warm dark variant
   ═══════════════════════════════════════════════════════════════════════════ */

function useColors(dark) {
  if (dark) {
    // Warm dark variant — preserves the editorial personality of the original
    return {
      text: "#E8E4DF",
      textLight: "#B0A99E",
      textFaint: "#7A7368",
      textGhost: "#3D3832",
      card: "#2A2622",
      border: "#3D3832",
      accent: "#D9654A", // warm orange, lifted from original #C44D2B
      accentSoft: "rgba(217, 101, 74, 0.12)",
      green: "#6AAE78",
      blue: "#6A94AD",
      purple: "#8E6AAD",
      warm: "#D9A84A",
      genres: {
        indie: "#6AAE78",
        pop: "#D9654A",
        electronic: "#6A94AD",
        "r&b": "#8E6AAD",
        "hip-hop": "#D9A84A",
        rock: "#AD6A6A",
        jazz: "#AD9A6A",
      },
      themes: {
        love: "#D9654A",
        heartbreak: "#6A94AD",
        empowerment: "#D9A84A",
        escapism: "#8E6AAD",
        nostalgia: "#6AAE78",
      },
    };
  }
  // Original editorial light palette
  return {
    text: "#1A1A1A",
    textLight: "#6B6B68",
    textFaint: "#9A9A96",
    textGhost: "#D4D4CE",
    card: "#FFFFFF",
    border: "#E8E8E2",
    accent: "#C44D2B",
    accentSoft: "rgba(196, 77, 43, 0.08)",
    green: "#4A8C5C",
    blue: "#4A6E8C",
    purple: "#6E4A8C",
    warm: "#C49030",
    genres: {
      indie: "#4A8C5C",
      pop: "#C44D2B",
      electronic: "#4A6E8C",
      "r&b": "#6E4A8C",
      "hip-hop": "#C49030",
      rock: "#8C4A4A",
      jazz: "#8C7A4A",
    },
    themes: {
      love: "#C44D2B",
      heartbreak: "#4A6E8C",
      empowerment: "#C49030",
      escapism: "#6E4A8C",
      nostalgia: "#4A8C5C",
    },
  };
}

/* ═══════════════════════════════════════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════════════════════════════════════ */

const FONT = "'IBM Plex Mono', monospace";

function ChartTooltip({ active, payload, label, colors }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: colors.card,
        border: `1px solid ${colors.border}`,
        borderRadius: 6,
        padding: "8px 12px",
        fontSize: 12,
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      }}
    >
      <div
        style={{
          fontWeight: 600,
          color: colors.text,
          marginBottom: 2,
          fontFamily: FONT,
        }}
      >
        {fm(label)}
      </div>
      {payload.map((p, i) => (
        <div
          key={i}
          style={{
            color: p.color || colors.textLight,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: p.color,
              display: "inline-block",
            }}
          />
          {p.name}:{" "}
          {typeof p.value === "number"
            ? p.name === "sentiment"
              ? p.value.toFixed(3)
              : p.value
            : p.value}
        </div>
      ))}
    </div>
  );
}

function Pullquote({ children, color, colors }) {
  return (
    <div
      style={{
        borderLeft: `3px solid ${color || colors.accent}`,
        paddingLeft: 24,
        margin: "36px 0",
        fontSize: 17,
        lineHeight: 1.55,
        fontFamily: FONT,
        fontStyle: "italic",
        color: colors.text,
        fontWeight: 400,
        maxWidth: 540,
      }}
    >
      {children}
    </div>
  );
}

function Annotation({ children, style, colors }) {
  return (
    <div
      style={{
        fontSize: 11,
        color: colors.textFaint,
        fontFamily: FONT,
        letterSpacing: "0.01em",
        lineHeight: 1.5,
        marginTop: 8,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function GenreLegend({ colors }) {
  return (
    <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 10 }}>
      {Object.entries(colors.genres).map(([g, col]) => (
        <div
          key={g}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            fontSize: 11,
            color: colors.textLight,
          }}
        >
          <div
            style={{ width: 8, height: 8, borderRadius: 2, background: col }}
          />
          {g}
        </div>
      ))}
    </div>
  );
}

function Stat({ value, label, color, small, colors }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          fontSize: small ? 28 : 36,
          fontWeight: 700,
          fontFamily: FONT,
          color: color || colors.text,
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 11,
          color: colors.textFaint,
          marginTop: 4,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN
   ═══════════════════════════════════════════════════════════════════════════ */

export default function SpotifyStory() {
  const [vis, setVis] = useState({});
  const [highlightedEvent, setHighlightedEvent] = useState(null);
  const dark = useTheme();
  const C = useColors(dark);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVis((prev) => ({ ...prev, [e.target.dataset.section]: true }));
          }
        });
      },
      { threshold: 0.15 },
    );
    document
      .querySelectorAll("[data-section]")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const sectionStyle = (id) => ({
    opacity: vis[id] ? 1 : 0,
    transition: "opacity 0.7s ease, transform 0.7s ease",
  });

  // Shared tooltip renderer that passes colors
  const renderTooltip = (props) => <ChartTooltip {...props} colors={C} />;

  return (
    <div style={{ color: C.text, fontFamily: FONT }}>
      <style>{`
        .spotify-story ::selection { background: ${C.accentSoft}; }
        @keyframes spotifyFadeUp { } }
        .spotify-story .fade-up { }
        .spotify-story .fade-up-d1 { }
        .spotify-story .fade-up-d2 { }
        .spotify-story .fade-up-d3 { }
      `}</style>

      <div className="spotify-story">
        {/* ─── HERO ─── */}
        <header style={{ maxWidth: 720, padding: "0px 0 0px" }}>
          <div
            className="fade-up"
            style={{
              fontSize: 11,
              fontFamily: FONT,
              color: C.accent,
              letterSpacing: "0.1em",
              textTransform: "lowercase",
            }}
          >
            A special data experiment
          </div>
          <p
            className="fade-up-d2"
            style={{
              fontSize: 15,
              fontFamily: FONT,
              color: C.textLight,
              lineHeight: 1.65,
              margin: "20px 0 0",
            }}
          >
            Since December 2022, I have made a playlist each month containing my
            favorites of the month. I liked the idea of being able to look back
            and relive certain memories. Coming up on year three, I wanted to
            know if there were more patterns of be found.
          </p>

          <p
            className="fade-up-d2"
            style={{
              fontSize: 15,
              fontFamily: FONT,
              color: C.textLight,
              lineHeight: 1.65,
              margin: "24px 0 0",
            }}
          >
            Collating and analyzing the data, this is what 38 months of saved
            Spotify tracks say about how my taste and mood.
          </p>

          <p>At a glance:</p>
          <div
            className="fade-up-d3"
            style={{
              display: "flex",
              gap: 36,
              marginTop: 20,
              // paddingTop: 20,
              paddingBottom: 20,
              // borderTop: `1px solid ${C.border}`,
              // borderBottom: `1px solid ${C.border}`,
            }}
          >
            <Stat value="735" label="Tracks" colors={C} />
            <Stat value="38" label="Months" colors={C} />
            <Stat
              value="0.46"
              label="Avg Sentiment"
              color={C.green}
              colors={C}
            />
          </div>
        </header>

        {/* ─── BODY ─── */}
        <main style={{ maxWidth: 720 }}>
          {/* ─── SECTION 1: The Overview ─── */}
          <section
            data-section="s1"
            style={{
              padding: "20px 0",
              maxWidth: "none",
              margin: 0,
              ...sectionStyle("s1"),
            }}
          >
            <p
              style={{
                fontSize: 14,
                fontFamily: FONT,
                lineHeight: 1.75,
                color: C.text,
                margin: "0 0 24px",
              }}
            >
              Since Spotify's API doesn't provide song information like tempo,
              energy, valence, or "dancability" anymore, I pulled genre tags
              from Last.fm's API. I pulled each song's lyrics from Genius and
              ran sentiment analysis on the prose with VADER.
            </p>
            <p
              style={{
                fontSize: 14,
                fontFamily: FONT,
                lineHeight: 1.75,
                color: C.text,
                margin: "0 0 24px",
              }}
            >
              What I didn't expect was that the data would map kinda cleanly
              onto my life. The month I graduated had the darkest lyrics I'd
              ever saved. And each trip home to Bangkok shows up as a spike in
              positive sentiment. And when I moved, I unconsciously replaced a
              lot of my artist roster.
            </p>
            <p
              style={{
                fontSize: 14,
                fontFamily: FONT,
                lineHeight: 1.75,
                color: C.text,
                margin: "0 0 8px",
              }}
            >
              My monthly listening volume with lyrical sentiment overlaid:
            </p>

            {/* MAIN CHART */}
            <div
              style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                padding: "24px 16px 16px",
                marginTop: 20,
              }}
            >
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart
                  data={sentimentData}
                  margin={{ top: 16, right: 8, bottom: 0, left: -8 }}
                  onMouseMove={(state) => {
                    if (
                      state?.activeLabel &&
                      lifeEventByMonth[state.activeLabel]
                    ) {
                      setHighlightedEvent(state.activeLabel);
                    } else {
                      setHighlightedEvent((prev) =>
                        prev && lifeEventByMonth[prev] ? null : prev,
                      );
                    }
                  }}
                  onMouseLeave={() => setHighlightedEvent(null)}
                >
                  <defs>
                    <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor={C.textGhost}
                        stopOpacity={0.5}
                      />
                      <stop
                        offset="100%"
                        stopColor={C.textGhost}
                        stopOpacity={0}
                      />
                    </linearGradient>
                    <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={C.green} stopOpacity={0.2} />
                      <stop offset="100%" stopColor={C.green} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                  <XAxis
                    dataKey="month"
                    tickFormatter={fm}
                    tick={{ fill: C.textFaint, fontSize: 10, fontFamily: FONT }}
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
                    label={{
                      value: "tracks",
                      angle: -90,
                      position: "insideLeft",
                      style: { fontSize: 10, fill: C.textFaint },
                    }}
                  />
                  <YAxis
                    yAxisId="s"
                    orientation="right"
                    tick={{ fill: C.textFaint, fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    domain={[-0.2, 1]}
                    label={{
                      value: "sentiment",
                      angle: 90,
                      position: "insideRight",
                      style: { fontSize: 10, fill: C.textFaint },
                    }}
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
                        value:
                          lifeEventByMonth[highlightedEvent]?.icon +
                          " " +
                          lifeEventByMonth[highlightedEvent]?.label,
                        position: "top",
                        fill: C.accent,
                        fontSize: 10,
                        fontFamily: FONT,
                      }}
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
              <Annotation colors={C}>
                In the back, monthly "favorites" count. In the front, average
                lyrical sentiment (VADER score, -1 to 1)
              </Annotation>
            </div>

            {/* Life events strip */}
            <div
              style={{
                display: "flex",
                gap: 6,
                flexWrap: "wrap",
                marginTop: 16,
              }}
            >
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
                    <span
                      style={{
                        color: isHighlighted ? C.accent : C.textFaint,
                        fontFamily: FONT,
                        fontSize: 10,
                      }}
                    >
                      {fm(ev.month)}
                    </span>
                  </span>
                );
              })}
            </div>

            <p
              style={{
                fontSize: 14,
                fontFamily: FONT,
                lineHeight: 1.75,
                color: C.text,
                margin: "20px 0 20px",
              }}
            >
              I graduated in May 2024, and it's the single quietest and saddest
              month in 38 months of data. Only 9 tracks saved. A sentiment score
              of <code style={{ color: C.accent }}>-0.132</code>, the only time
              it ever went negative.
            </p>

            <p
              style={{
                fontSize: 14,
                fontFamily: FONT,
                lineHeight: 1.75,
                color: C.text,
                margin: "0 0 8px",
              }}
            >
              Something about endings?
            </p>
          </section>

          {/* ─── SECTION 3: Genre DNA ─── */}
          <section
            data-section="s3"
            style={{
              padding: "56px 0",
              maxWidth: "none",
              margin: 0,
              ...sectionStyle("s3"),
            }}
          >
            <h2
              style={{
                fontFamily: FONT,
                fontSize: 22,
                fontWeight: 600,
                margin: "0 0 20px",
                letterSpacing: "-0.01em",
                color: C.text,
                border: "none",
              }}
            >
              What genres I listen to
            </h2>
            <p
              style={{
                fontSize: 14,
                fontFamily: FONT,
                lineHeight: 1.75,
                color: C.text,
                margin: "0 0 24px",
              }}
            >
              My favorites from the last three years are (very roughly) 40%
              indie, 32% pop, and then a scattering of everything else. These
              proportions have varied over time.
            </p>

            <div
              style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                padding: "24px 16px 16px",
              }}
            >
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={streamgraphData}
                  stackOffset="expand"
                  margin={{ top: 10, right: 8, bottom: 0, left: -8 }}
                >
                  <XAxis
                    dataKey="month"
                    tickFormatter={fm}
                    tick={{ fill: C.textFaint, fontSize: 10, fontFamily: FONT }}
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
                Proportional genre share per month — height = % of that month's
                total, not absolute count
              </Annotation>
            </div>

            <p
              style={{
                fontSize: 14,
                fontFamily: FONT,
                lineHeight: 1.75,
                color: C.text,
                margin: "28px 0 0",
              }}
            >
              A few things stand out. Indie (green) was dominant in late 2022
              (73% of what I saved that December) and remains the backbone
              throughout. Pop surges during album cycles: November '23 with
              Taylor Swift's <em>1989 TV</em>, June '24 with <em>brat</em>, and
              August '25 with Sabrina Carpenter. Hip-hop was most present early
              on and has almost completely faded from my favorites.
            </p>
          </section>

          {/* ─── SECTION 4: The 93% Reset ─── */}
          <section
            data-section="s4"
            style={{
              padding: "56px 0",
              maxWidth: "none",
              margin: 0,
              ...sectionStyle("s4"),
            }}
          >
            <h2
              style={{
                fontFamily: FONT,
                fontSize: 22,
                fontWeight: 600,
                margin: "0 0 20px",
                letterSpacing: "-0.01em",
                color: C.text,
                border: "none",
              }}
            >
              Who I dropped
            </h2>
            <p
              style={{
                fontSize: 14,
                fontFamily: FONT,
                lineHeight: 1.75,
                color: C.text,
                margin: "0 0 20px",
              }}
            >
              In August 2024, I moved from Bangkok to Vancouver. That month, I
              favorited only 7 tracks, but 93% were from artists I had never
              saved before.
            </p>

            <div
              style={{
                display: "flex",
                gap: 16,
                margin: "28px 0",
                flexWrap: "wrap",
              }}
            >
              {[
                {
                  era: "bangkok",
                  period: "dec '22 – jul '24",
                  tracks: 466,
                  sentiment: "0.468",
                  topGenre: "Indie (39%)",
                  top: "Taylor Swift, Charli xcx, The 1975",
                  color: C.warm,
                },
                {
                  era: "moving",
                  period: "aug '24",
                  tracks: 28,
                  sentiment: "0.602",
                  topGenre: "Indie (43%)",
                  top: "Sabrina Carpenter, beabadoobee, wave to earth",
                  color: C.purple,
                },
                {
                  era: "vancouver",
                  period: "sep '24 – jan '26",
                  tracks: 241,
                  sentiment: "0.449",
                  topGenre: "Indie (41%)",
                  top: "Sabrina Carpenter, beabadoobee, Charli xcx",
                  color: C.blue,
                },
              ].map((e) => (
                <div
                  key={e.era}
                  style={{
                    flex: "1 1 180px",
                    background: C.card,
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                    padding: 20,
                    borderTop: `3px solid ${e.color}`,
                  }}
                >
                  <div
                    style={{
                      fontFamily: FONT,
                      fontSize: 14,
                      fontWeight: 600,
                      color: e.color,
                    }}
                  >
                    {e.era}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      fontFamily: FONT,
                      color: C.textFaint,
                      marginBottom: 12,
                    }}
                  >
                    {e.period}
                  </div>
                  <div
                    style={{
                      fontSize: 32,
                      fontWeight: 700,
                      fontFamily: FONT,
                      color: C.text,
                    }}
                  >
                    {e.tracks}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: C.textFaint,
                      marginBottom: 10,
                    }}
                  >
                    tracks
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: C.textLight,
                      lineHeight: 1.6,
                      fontFamily: FONT,
                    }}
                  >
                    Sentiment: <strong>{e.sentiment}</strong>
                    <br />
                    {e.topGenre}
                    <br />
                    <span style={{ color: C.textFaint }}>{e.top}</span>
                  </div>
                </div>
              ))}
            </div>

            <p
              style={{
                fontSize: 14,
                fontFamily: FONT,
                lineHeight: 1.75,
                color: C.text,
                margin: "0 0 20px",
              }}
            >
              Interestingly, moving month had the highest sentiment of any phase
              — <code style={{ color: C.green }}>0.602</code>. I think maybe it
              was the optimism of moving somewhere new.
            </p>
            <p
              style={{
                fontSize: 14,
                fontFamily: FONT,
                lineHeight: 1.75,
                color: C.text,
                margin: 0,
              }}
            >
              Taylor Swift, who'd been in my top 3 for a year and a half, did
              NOT make the trip... she vanished entirely after April 2024.
              Sabrina Carpenter and beabadoobee, who'd been hovering in the
              background, became my new headliners.
            </p>
          </section>

          {/* ─── SECTION 5: Artist Orbits ─── */}
          <section
            data-section="s5"
            style={{
              padding: "56px 0",
              maxWidth: "none",
              margin: 0,
              ...sectionStyle("s5"),
            }}
          >
            <h2
              style={{
                fontFamily: FONT,
                fontSize: 22,
                fontWeight: 600,
                margin: "0 0 20px",
                letterSpacing: "-0.01em",
                color: C.text,
                border: "none",
              }}
            >
              Who stuck around
            </h2>
            <p
              style={{
                fontSize: 14,
                fontFamily: FONT,
                lineHeight: 1.75,
                color: C.text,
                margin: "0 0 24px",
              }}
            >
              This beautiful chart maps when each of my top artists appeared in
              my favorites. Bigger dots = more tracks that month. Some artists
              defined a single era, and others persisted across the whole
              timeline.
            </p>

            <div
              style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                padding: "24px 20px 16px",
                overflowX: "auto",
              }}
            >
              <div style={{ minWidth: 600 }}>
                {artistTimeline.map((artist, ai) => (
                  <div
                    key={artist.artist}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "7px 0",
                      borderBottom:
                        ai < artistTimeline.length - 1
                          ? `1px solid ${C.border}`
                          : "none",
                    }}
                  >
                    <div
                      style={{ width: 130, flexShrink: 0, paddingRight: 12 }}
                    >
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 500,
                          color: C.text,
                          fontFamily: FONT,
                        }}
                      >
                        {artist.artist}
                      </div>
                      <div
                        style={{
                          fontSize: 10,
                          color: C.textFaint,
                          fontFamily: FONT,
                        }}
                      >
                        {artist.total} tracks
                      </div>
                    </div>
                    <div style={{ flex: 1, position: "relative", height: 24 }}>
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: 0,
                          right: 0,
                          height: 1,
                          background: C.border,
                        }}
                      />
                      {/* Move line marker */}
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          bottom: 0,
                          width: 1,
                          left: `${(monthIdx["2024-08"] / (allMonths.length - 1)) * 100}%`,
                          background: C.accent,
                          opacity: 0.15,
                        }}
                      />
                      {artist.appearances.map((a, i) => {
                        const idx = monthIdx[a.m];
                        if (idx === undefined) return null;
                        const x = (idx / (allMonths.length - 1)) * 100;
                        const size = Math.min(18, 5 + a.c * 2.2);
                        return (
                          <div
                            key={i}
                            title={`${fm(a.m)}: ${a.c} track${a.c > 1 ? "s" : ""}`}
                            style={{
                              position: "absolute",
                              left: `${x}%`,
                              top: "50%",
                              transform: "translate(-50%, -50%)",
                              width: size,
                              height: size,
                              borderRadius: "50%",
                              background: artist.color,
                              opacity: 0.85,
                              cursor: "default",
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
                <div
                  style={{
                    position: "relative",
                    marginLeft: 130,
                    marginTop: 6,
                    paddingBottom: 24,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  {allMonths
                    .filter((_, i) => i % 6 === 0 || i === allMonths.length - 1)
                    .map((m) => (
                      <span
                        key={m}
                        style={{
                          fontSize: 9,
                          color: C.textFaint,
                          fontFamily: FONT,
                        }}
                      >
                        {fm(m)}
                      </span>
                    ))}
                  {/* Red "moved" label positioned well below x-axis */}
                  <span
                    style={{
                      position: "absolute",
                      left: `${(monthIdx["2024-08"] / (allMonths.length - 1)) * 100}%`,
                      transform: "translateX(-50%)",
                      top: 22,
                      fontSize: 9,
                      fontWeight: 600,
                      color: C.accent,
                      fontFamily: FONT,
                      whiteSpace: "nowrap",
                      opacity: 0.45,
                    }}
                  >
                    moved to YVR
                  </span>
                </div>
              </div>
            </div>

            <p
              style={{
                fontSize: 14,
                fontFamily: FONT,
                lineHeight: 1.75,
                color: C.text,
                margin: "24px 0 0",
              }}
            >
              <span style={{ color: "#C9884A" }}>Sabrina Carpenter</span>{" "}
              appeared in 15 different months across 3 years. She's definitely
              stuck around, and so has{" "}
              <span style={{ color: "#6A9E5E" }}>beabadoobee</span>.
            </p>
          </section>

          {/* ─── SECTION 6: Themes ─── */}
          <section
            data-section="s6"
            style={{
              padding: "56px 0",
              maxWidth: "none",
              margin: 0,
              ...sectionStyle("s6"),
            }}
          >
            <h2
              style={{
                fontFamily: FONT,
                fontSize: 22,
                fontWeight: 600,
                margin: "0 0 20px",
                letterSpacing: "-0.01em",
                color: C.text,
                border: "none",
              }}
            >
              What I was singing about
            </h2>
            <p
              style={{
                fontSize: 14,
                fontFamily: FONT,
                lineHeight: 1.75,
                color: C.text,
                margin: "0 0 24px",
              }}
            >
              The NLP analysis I did on the lyrics of every track tagged five
              recurring themes. Love dominates (it's pop), but the smaller
              themes reveal the most.
            </p>

            <div
              style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                padding: "24px 16px 16px",
              }}
            >
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart
                  data={themeData}
                  margin={{ top: 10, right: 8, bottom: 0, left: -8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                  <XAxis
                    dataKey="month"
                    tickFormatter={fm}
                    tick={{ fill: C.textFaint, fontSize: 10, fontFamily: FONT }}
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
                  <Area
                    type="monotone"
                    dataKey="love"
                    stroke={C.themes.love}
                    fill={C.themes.love}
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="heartbreak"
                    stroke={C.themes.heartbreak}
                    fill={C.themes.heartbreak}
                    fillOpacity={0.08}
                    strokeWidth={1.5}
                  />
                  <Area
                    type="monotone"
                    dataKey="nostalgia"
                    stroke={C.themes.nostalgia}
                    fill={C.themes.nostalgia}
                    fillOpacity={0.08}
                    strokeWidth={1.5}
                  />
                  <Area
                    type="monotone"
                    dataKey="escapism"
                    stroke={C.themes.escapism}
                    fill={C.themes.escapism}
                    fillOpacity={0.06}
                    strokeWidth={1}
                  />
                  <Area
                    type="monotone"
                    dataKey="empowerment"
                    stroke={C.themes.empowerment}
                    fill={C.themes.empowerment}
                    fillOpacity={0.06}
                    strokeWidth={1}
                  />
                </AreaChart>
              </ResponsiveContainer>
              <div
                style={{
                  display: "flex",
                  gap: 14,
                  marginTop: 10,
                  flexWrap: "wrap",
                }}
              >
                {Object.entries(C.themes).map(([t, col]) => (
                  <div
                    key={t}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      fontSize: 11,
                      color: C.textLight,
                    }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 2,
                        background: col,
                      }}
                    />
                    {t}
                  </div>
                ))}
              </div>
            </div>

            <p
              style={{
                fontSize: 14,
                fontFamily: FONT,
                lineHeight: 1.75,
                color: C.text,
                margin: "28px 0 0",
              }}
            >
              Every Febuary seem to be pretty loaded (haha): in February 2024, I
              favorited 32 love-tagged tracks and 15 heartbreak tracks.
              Nostalgia seems to peak during transition periods: it spiked in
              Feb '24 (last semester), Aug '25 (leaving home again), and the Dec
              '22 when I first started tracking.
            </p>
          </section>

          {/* ─── SECTION 7: Going Home ─── */}
          <section
            data-section="s7"
            style={{
              padding: "56px 0",
              maxWidth: "none",
              margin: 0,
              ...sectionStyle("s7"),
            }}
          >
            <h2
              style={{
                fontFamily: FONT,
                fontSize: 22,
                fontWeight: 600,
                margin: "0 0 20px",
                letterSpacing: "-0.01em",
                color: C.text,
                border: "none",
              }}
            >
              Going home
            </h2>
            <p
              style={{
                fontSize: 14,
                fontFamily: FONT,
                lineHeight: 1.75,
                color: C.text,
                margin: "0 0 24px",
              }}
            >
              Maybe the cleanest pattern in the entire dataset: every time I go
              back to Bangkok, the music I listen to is happier.
            </p>

            <div
              style={{
                display: "flex",
                gap: 0,
                margin: "20px 0 28px",
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              {homeTrips.map((trip, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    padding: "24px 20px",
                    borderRight:
                      i < homeTrips.length - 1
                        ? `1px solid ${C.border}`
                        : "none",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      color: C.textFaint,
                      fontFamily: FONT,
                      marginBottom: 4,
                    }}
                  >
                    {trip.month}
                  </div>
                  <div
                    style={{
                      fontSize: 32,
                      fontWeight: 700,
                      fontFamily: FONT,
                      color: C.green,
                      lineHeight: 1,
                    }}
                  >
                    {trip.sentiment.toFixed(3)}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: C.textLight,
                      marginTop: 6,
                      fontFamily: FONT,
                    }}
                  >
                    {trip.label}
                  </div>
                </div>
              ))}
            </div>

            <p
              style={{
                fontSize: 14,
                fontFamily: FONT,
                lineHeight: 1.75,
                color: C.text,
                margin: "0 0 20px",
              }}
            >
              For context, my overall average is <code>0.46</code>. December
              2025 — two weeks at home for New Year's — hit{" "}
              <code style={{ color: C.green }}>0.800</code>, the highest of the
              entire timeline. Every trip back pushes the needle higher than the
              surrounding months.
            </p>
          </section>

          {/* ─── CLOSING ─── */}
          <section
            data-section="s8"
            style={{
              padding: "56px 0 20px",
              maxWidth: "none",
              margin: 0,
              ...sectionStyle("s8"),
            }}
          >
            <h2
              style={{
                fontFamily: FONT,
                fontSize: 22,
                fontWeight: 600,
                margin: "0 0 20px",
                letterSpacing: "-0.01em",
                color: C.text,
                border: "none",
              }}
            >
              Was I surprised?
            </h2>
            <p
              style={{
                fontSize: 14,
                fontFamily: FONT,
                lineHeight: 1.75,
                color: C.text,
                margin: "0 0 20px",
              }}
            >
              It was cool that the data made legible something I'd only felt —
              that moving (really, my environment) changed how I listen. The
              artists I brought with me, the ones I left behind, what I felt in
              that graduation month, the brightness of coming home. You can
              really see it in the numbers.
            </p>
            <p
              style={{
                fontSize: 14,
                fontFamily: FONT,
                lineHeight: 1.75,
                color: C.text,
                margin: "0 0 20px",
              }}
            >
              Something something music is memory compressed?
            </p>
            <p
              style={{
                fontSize: 14,
                fontFamily: FONT,
                lineHeight: 1.75,
                color: C.text,
                margin: "0 0 20px",
              }}
            >
              For next time, I'd really like to learn more about effective
              interactive visualizations. You have to check out{" "}
              <a
                href="https://pudding.cool/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: C.accent }}
              >
                pudding.cool/
              </a>
              .
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                padding: 24,
                marginTop: 32,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontFamily: FONT,
                  color: C.textFaint,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 4,
                }}
              >
                Methodology
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: C.textLight,
                  lineHeight: 1.7,
                  fontFamily: FONT,
                }}
              >
                Data sourced from Spotify saved tracks (Dec 2022 – Jan 2026).
                Genre classification via Last.fm API tags. Lyrical sentiment
                analysis via VADER (compound score) on lyrics pulled from
                Genius. Theme tagging via keyword/NLP classification on lyrics.
                "New artist" = first-ever appearance in saved tracks. Analysis
                done in Python; visualization in React + Recharts.
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
