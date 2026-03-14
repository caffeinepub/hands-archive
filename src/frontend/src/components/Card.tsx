import { useState } from "react";
import type { ArchiveItem } from "../data";
import { formatDuration } from "../data";

type CardProps = {
  item: ArchiveItem;
  onClick: (item: ArchiveItem) => void;
  "data-ocid"?: string;
};

function getTypeBadge(item: ArchiveItem): string {
  switch (item.type) {
    case "song":
      return "SONG";
    case "album":
      return "ALBUM";
    case "member":
      return "MEMBER";
    case "show":
      return "LIVE SHOW";
  }
}

function getSubtitle(item: ArchiveItem): string {
  switch (item.type) {
    case "song":
      return `${item.album} · ${item.year} · ${formatDuration(item.duration)}`;
    case "album":
      return `${item.year} · ${item.trackList.length} TRACKS`;
    case "member":
      return `${item.role} · ${item.years[0]}–${item.years[1] ?? "PRESENT"}`;
    case "show":
      return `${item.date} · ${item.city}`;
  }
}

function getTitle(item: ArchiveItem): string {
  if (item.type === "member") return item.name;
  return item.title;
}

function getDescription(item: ArchiveItem): string {
  if (item.type === "member") return item.bio;
  return item.description;
}

export function ArchiveCard({ item, onClick, "data-ocid": ocid }: CardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      data-ocid={ocid}
      onClick={() => onClick(item)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: hovered ? "3px solid black" : "1px solid black",
        padding: hovered ? "14px" : "16px",
        cursor: "pointer",
        background: "#fff",
        transition: "border-width 0.05s, padding 0.05s",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        width: "100%",
        textAlign: "left",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 900,
            fontSize: "16px",
            textTransform: "uppercase",
            letterSpacing: "0.02em",
            lineHeight: 1.2,
          }}
        >
          {getTitle(item)}
        </div>
        <div
          style={{
            fontSize: "10px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "#888",
            border: "1px solid #ccc",
            padding: "2px 6px",
            whiteSpace: "nowrap",
            marginLeft: "8px",
            flexShrink: 0,
          }}
        >
          {getTypeBadge(item)}
        </div>
      </div>
      <div
        style={{
          fontSize: "11px",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "#666",
          fontWeight: 500,
        }}
      >
        {getSubtitle(item)}
      </div>
      <div
        style={{
          fontSize: "14px",
          color: "#333",
          marginTop: "4px",
          lineHeight: 1.5,
        }}
      >
        {getDescription(item)}
      </div>
    </button>
  );
}
