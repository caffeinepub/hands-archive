import type { ArchiveItem } from "../data";
import { ALBUMS, SHOWS } from "../data";

type Props = {
  onSelectItem: (item: ArchiveItem) => void;
};

export function TimelineView({ onSelectItem }: Props) {
  type TimelineEntry = {
    id: string;
    year: number;
    title: string;
    entryType: "album" | "show";
    item: ArchiveItem;
    subtitle: string;
  };

  const entries: TimelineEntry[] = [
    ...ALBUMS.map((a) => ({
      id: a.id,
      year: a.year,
      title: a.title,
      entryType: "album" as const,
      item: a,
      subtitle: `Album · ${a.year}`,
    })),
    ...SHOWS.map((s) => ({
      id: s.id,
      year: new Date(s.date).getFullYear(),
      title: s.title,
      entryType: "show" as const,
      item: s,
      subtitle: `Live · ${s.city}`,
    })),
  ].sort((a, b) => a.year - b.year);

  return (
    <div
      style={{
        padding: "48px",
        paddingBottom: "64px",
        height: "100%",
        overflowY: "auto",
      }}
    >
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
        Timeline
      </h2>

      <div
        data-ocid="timeline.panel"
        style={{
          overflowX: "auto",
          paddingBottom: "32px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "0",
            minWidth: "max-content",
            position: "relative",
          }}
        >
          {/* Horizontal line */}
          <div
            style={{
              position: "absolute",
              top: "64px",
              left: "0",
              right: "0",
              height: "2px",
              background: "#000",
              zIndex: 0,
            }}
          />

          {/* Foundation entry */}
          <div
            style={{
              width: "200px",
              padding: "0 24px 0 0",
              flexShrink: 0,
              position: "relative",
              zIndex: 1,
            }}
          >
            <div
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "64px",
                fontWeight: 900,
                lineHeight: 1,
                color: "#eee",
                letterSpacing: "-0.04em",
              }}
            >
              2008
            </div>
            <div
              style={{
                width: "12px",
                height: "12px",
                background: "#000",
                margin: "12px 0",
              }}
            />
            <div
              style={{
                fontSize: "13px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Band Founded
            </div>
            <div
              style={{
                fontSize: "11px",
                color: "#666",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginTop: "4px",
              }}
            >
              Philadelphia, PA
            </div>
          </div>

          {entries.map((entry) => (
            <button
              type="button"
              key={entry.id}
              onClick={() => onSelectItem(entry.item)}
              style={{
                width: "220px",
                padding: "0 24px 0 0",
                flexShrink: 0,
                position: "relative",
                zIndex: 1,
                cursor: "pointer",
                background: "transparent",
                border: "none",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "64px",
                  fontWeight: 900,
                  lineHeight: 1,
                  color: entry.entryType === "album" ? "#000" : "#ccc",
                  letterSpacing: "-0.04em",
                }}
              >
                {entry.year}
              </div>
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  background: entry.entryType === "album" ? "#000" : "#fff",
                  border: "2px solid black",
                  margin: "12px 0",
                }}
              />
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  lineHeight: 1.3,
                }}
              >
                {entry.title}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "#666",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginTop: "4px",
                }}
              >
                {entry.subtitle}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
