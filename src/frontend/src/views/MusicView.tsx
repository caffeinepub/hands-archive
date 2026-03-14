import { ArchiveCard } from "../components/Card";
import type { ArchiveItem } from "../data";
import { ALBUMS, SONGS, formatDuration } from "../data";

type Props = {
  onSelectItem: (item: ArchiveItem) => void;
};

export function MusicView({ onSelectItem }: Props) {
  return (
    <div style={{ padding: "48px 48px 64px" }}>
      <h2
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "48px",
          fontWeight: 900,
          letterSpacing: "-0.03em",
          marginBottom: "48px",
          textTransform: "uppercase",
        }}
      >
        Music
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
        {ALBUMS.map((album) => {
          const tracks = SONGS.filter((s) => album.trackList.includes(s.id));
          return (
            <div key={album.id}>
              <div style={{ marginBottom: "16px" }}>
                <ArchiveCard item={album} onClick={onSelectItem} />
              </div>
              <div
                style={{
                  borderLeft: "2px solid black",
                  paddingLeft: "24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0",
                }}
              >
                <div
                  style={{
                    fontSize: "10px",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    color: "#999",
                    padding: "8px 0",
                    fontWeight: 600,
                  }}
                >
                  Track Listing
                </div>
                {tracks.map((song, idx) => (
                  <button
                    type="button"
                    key={song.id}
                    onClick={() => onSelectItem(song)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "10px 0",
                      cursor: "pointer",
                      gap: "16px",
                      background: "transparent",
                      border: "none",
                      borderTop: "1px solid #eee",
                      width: "100%",
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "#f8f8f8";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "transparent";
                    }}
                  >
                    <span
                      style={{
                        width: "24px",
                        fontSize: "11px",
                        color: "#aaa",
                        fontWeight: 600,
                        textAlign: "right",
                        flexShrink: 0,
                      }}
                    >
                      {idx + 1}
                    </span>
                    <span
                      style={{ fontWeight: 600, fontSize: "14px", flex: 1 }}
                    >
                      {song.title}
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        color: "#888",
                        fontFamily: "monospace",
                      }}
                    >
                      {formatDuration(song.duration)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
