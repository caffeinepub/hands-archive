import { ArchiveCard } from "../components/Card";
import { ALBUMS, SONGS, formatDuration, getRelatedItems } from "../data";
import type { ArchiveItem } from "../data";

type Props = {
  item: ArchiveItem;
  onBack: () => void;
  onSelectItem: (item: ArchiveItem) => void;
};

function getTitle(item: ArchiveItem): string {
  if (item.type === "member") return item.name;
  return item.title;
}

export function DetailView({ item, onBack, onSelectItem }: Props) {
  const related = getRelatedItems(item);

  return (
    <div
      data-ocid="detail.panel"
      style={{ padding: "48px 48px 64px", maxWidth: "800px" }}
    >
      <button
        type="button"
        data-ocid="detail.close_button"
        onClick={onBack}
        style={{
          fontSize: "11px",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          fontWeight: 700,
          border: "1px solid black",
          padding: "6px 16px",
          background: "#fff",
          cursor: "pointer",
          marginBottom: "40px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "#000";
          (e.currentTarget as HTMLButtonElement).style.color = "#fff";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "#fff";
          (e.currentTarget as HTMLButtonElement).style.color = "#000";
        }}
      >
        ← Back
      </button>

      <div
        style={{
          fontSize: "11px",
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          color: "#666",
          marginBottom: "8px",
          fontWeight: 600,
        }}
      >
        {item.type}
      </div>

      <h2
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "48px",
          fontWeight: 900,
          letterSpacing: "-0.03em",
          textTransform: "uppercase",
          lineHeight: 1.1,
          marginBottom: "24px",
          borderBottom: "2px solid black",
          paddingBottom: "24px",
        }}
      >
        {getTitle(item)}
      </h2>

      {/* Metadata grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: "1px",
          background: "#000",
          marginBottom: "32px",
        }}
      >
        {item.type === "song" &&
          [
            { key: "Album", val: item.album },
            { key: "Year", val: String(item.year) },
            { key: "Duration", val: formatDuration(item.duration) },
          ].map(({ key, val }) => (
            <div key={key} style={{ background: "#fff", padding: "16px" }}>
              <div
                style={{
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "#888",
                  marginBottom: "4px",
                  fontWeight: 600,
                }}
              >
                {key}
              </div>
              <div style={{ fontWeight: 700, fontSize: "16px" }}>{val}</div>
            </div>
          ))}
        {item.type === "album" &&
          [
            { key: "Year", val: String(item.year) },
            { key: "Tracks", val: String(item.trackList.length) },
          ].map(({ key, val }) => (
            <div key={key} style={{ background: "#fff", padding: "16px" }}>
              <div
                style={{
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "#888",
                  marginBottom: "4px",
                  fontWeight: 600,
                }}
              >
                {key}
              </div>
              <div style={{ fontWeight: 700, fontSize: "16px" }}>{val}</div>
            </div>
          ))}
        {item.type === "member" &&
          [
            { key: "Role", val: item.role },
            { key: "Since", val: String(item.years[0]) },
            { key: "Status", val: item.years[1] ? "Former" : "Active" },
          ].map(({ key, val }) => (
            <div key={key} style={{ background: "#fff", padding: "16px" }}>
              <div
                style={{
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "#888",
                  marginBottom: "4px",
                  fontWeight: 600,
                }}
              >
                {key}
              </div>
              <div style={{ fontWeight: 700, fontSize: "16px" }}>{val}</div>
            </div>
          ))}
        {item.type === "show" &&
          [
            { key: "Date", val: item.date },
            { key: "Venue", val: item.venue },
            { key: "City", val: item.city },
          ].map(({ key, val }) => (
            <div key={key} style={{ background: "#fff", padding: "16px" }}>
              <div
                style={{
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "#888",
                  marginBottom: "4px",
                  fontWeight: 600,
                }}
              >
                {key}
              </div>
              <div style={{ fontWeight: 700, fontSize: "16px" }}>{val}</div>
            </div>
          ))}
      </div>

      {/* Description */}
      <div
        style={{
          fontSize: "16px",
          lineHeight: 1.7,
          marginBottom: "48px",
          color: "#222",
          maxWidth: "600px",
        }}
      >
        {item.type === "member" ? item.bio : item.description}
      </div>

      {/* Track listing for albums */}
      {item.type === "album" && (
        <div style={{ marginBottom: "48px" }}>
          <div
            style={{
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "#666",
              fontWeight: 600,
              borderBottom: "1px solid black",
              paddingBottom: "8px",
              marginBottom: "0",
            }}
          >
            Track Listing
          </div>
          {item.trackList.map((sid, idx) => {
            const song = SONGS.find((s) => s.id === sid);
            if (!song) return null;
            return (
              <button
                type="button"
                key={sid}
                onClick={() => onSelectItem(song)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "12px 0",
                  cursor: "pointer",
                  gap: "16px",
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  borderBottom: "1px solid #eee",
                  textAlign: "left",
                }}
              >
                <span
                  style={{
                    width: "24px",
                    textAlign: "right",
                    fontSize: "11px",
                    color: "#aaa",
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  {idx + 1}
                </span>
                <span style={{ flex: 1, fontWeight: 600, fontSize: "14px" }}>
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
            );
          })}
        </div>
      )}

      {/* Song album info */}
      {item.type === "song" &&
        (() => {
          const album = ALBUMS.find((a) => a.title === item.album);
          if (!album) return null;
          return (
            <div style={{ marginBottom: "48px" }}>
              <div
                style={{
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  color: "#666",
                  fontWeight: 600,
                  marginBottom: "12px",
                }}
              >
                From the Album
              </div>
              <div style={{ maxWidth: "400px" }}>
                <ArchiveCard item={album} onClick={onSelectItem} />
              </div>
            </div>
          );
        })()}

      {/* Related items */}
      {related.length > 0 && (
        <div>
          <div
            style={{
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "#666",
              fontWeight: 600,
              borderBottom: "1px solid black",
              paddingBottom: "8px",
              marginBottom: "16px",
            }}
          >
            Related
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "1px",
              background: "#000",
            }}
          >
            {related.map((rel) => (
              <div key={rel.id} style={{ background: "#fff" }}>
                <ArchiveCard item={rel} onClick={onSelectItem} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
