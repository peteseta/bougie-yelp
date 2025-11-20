import satori from "satori";
import type { CollectionEntry } from "astro:content";
import { SITE } from "@config";
import loadGoogleFonts, { type FontOptions } from "../loadGoogleFont";
import { OG_STYLES, OG_CONFIG } from "./styles";

export default async (post: CollectionEntry<"blog">) => {
  return satori(
    <div style={OG_STYLES.container}>
      <div style={OG_STYLES.shadow} />
      <div style={OG_STYLES.card}>
        <div style={OG_STYLES.content}>
          <p
            style={{
              fontSize: 72,
              fontWeight: "bold",
              maxHeight: "84%",
              overflow: "hidden",
            }}
          >
            {post.data.title}
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              marginBottom: "8px",
              fontSize: 28,
            }}
          >
            <span>
              by{" "}
              <span
                style={{
                  color: "transparent",
                }}
              >
                "
              </span>
              <span style={{ overflow: "hidden", fontWeight: "bold" }}>
                {post.data.author}
              </span>
            </span>

            <span style={{ overflow: "hidden", fontWeight: "bold" }}>
              {SITE.title}
            </span>
          </div>
        </div>
      </div>
    </div>,
    {
      ...OG_CONFIG,
      fonts: (await loadGoogleFonts(
        post.data.title + post.data.author + SITE.title + "by"
      )) as FontOptions[],
    }
  );
};
