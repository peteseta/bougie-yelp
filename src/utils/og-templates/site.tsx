import satori from "satori";
import { SITE } from "@config";
import loadGoogleFonts, { type FontOptions } from "../loadGoogleFont";
import { OG_STYLES, OG_CONFIG } from "./styles";

export default async () => {
  return satori(
    <div style={OG_STYLES.container}>
      <div style={OG_STYLES.shadow} />
      <div style={OG_STYLES.card}>
        <div style={OG_STYLES.content}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "90%",
              maxHeight: "90%",
              overflow: "hidden",
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: 72, fontWeight: "bold" }}>{SITE.title}</p>
            <p style={{ fontSize: 28 }}>{SITE.desc}</p>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              width: "100%",
              marginBottom: "8px",
              fontSize: 28,
            }}
          >
            <span style={{ overflow: "hidden", fontWeight: "bold" }}>
              {new URL(SITE.website).hostname}
            </span>
          </div>
        </div>
      </div>
    </div>,
    {
      ...OG_CONFIG,
      fonts: (await loadGoogleFonts(
        SITE.title + SITE.desc + SITE.website
      )) as FontOptions[],
    }
  );
};
