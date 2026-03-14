import { ArchiveCard } from "../components/Card";
import type { ArchiveItem } from "../data";
import { ALBUMS, SHOWS } from "../data";

type Props = {
  onSelectItem: (item: ArchiveItem) => void;
};

export function HomeView({ onSelectItem }: Props) {
  const latestAlbum = ALBUMS[ALBUMS.length - 1];
  const recentShows = SHOWS.slice(-2).reverse();

  return (
    <div style={{ padding: "48px 48px 64px", maxWidth: "960px" }}>
      <div style={{ marginBottom: "64px" }}>
        <h2
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "12px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            marginBottom: "24px",
            color: "#999",
          }}
        >
          About
        </h2>
        <p
          style={{
            fontSize: "28px",
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 700,
            lineHeight: 1.3,
            letterSpacing: "-0.01em",
            maxWidth: "680px",
          }}
        >
          Hands is a Philadelphia-based post-rock trio active since 2008. Their
          music occupies the space between noise and silence, texture and
          rhythm.
        </p>
      </div>

      <div
        style={{
          marginBottom: "64px",
          borderTop: "1px solid black",
          paddingTop: "32px",
        }}
      >
        <div
          style={{
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            color: "#666",
            marginBottom: "20px",
            fontWeight: 600,
          }}
        >
          Latest Release
        </div>
        <div style={{ maxWidth: "480px" }}>
          <ArchiveCard item={latestAlbum} onClick={onSelectItem} />
        </div>
      </div>

      <div style={{ borderTop: "1px solid black", paddingTop: "32px" }}>
        <div
          style={{
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            color: "#666",
            marginBottom: "20px",
            fontWeight: 600,
          }}
        >
          Recent Shows
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1px",
            background: "#000",
          }}
        >
          {recentShows.map((show) => (
            <div key={show.id} style={{ background: "#fff" }}>
              <ArchiveCard item={show} onClick={onSelectItem} />
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          marginTop: "80px",
          paddingTop: "32px",
          borderTop: "1px solid #eee",
          fontSize: "12px",
          color: "#aaa",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "underline", color: "#888" }}
          >
            caffeine.ai
          </a>
        </span>
        <span style={{ textTransform: "uppercase", letterSpacing: "0.1em" }}>
          HANDS Archive
        </span>
      </div>
    </div>
  );
}
