export type ViewName =
  | "home"
  | "music"
  | "archive"
  | "shows"
  | "media"
  | "graph"
  | "timeline"
  | "random"
  | "detail";

type SidebarProps = {
  currentView: ViewName;
  onNavigate: (view: ViewName) => void;
};

const NAV_ITEMS: {
  view: ViewName;
  label: string;
  ocid: string;
  shortcut?: string;
}[] = [
  { view: "home", label: "Home", ocid: "nav.home.link" },
  { view: "music", label: "Music", ocid: "nav.music.link" },
  {
    view: "archive",
    label: "Archive",
    ocid: "nav.archive.link",
    shortcut: "E",
  },
  { view: "shows", label: "Live Shows", ocid: "nav.shows.link" },
  { view: "media", label: "Media", ocid: "nav.media.link" },
  { view: "graph", label: "Graph View", ocid: "nav.graph.link", shortcut: "G" },
  {
    view: "timeline",
    label: "Timeline",
    ocid: "nav.timeline.link",
    shortcut: "T",
  },
  { view: "random", label: "Random", ocid: "nav.random.link", shortcut: "R" },
];

export function Sidebar({ currentView, onNavigate }: SidebarProps) {
  return (
    <nav
      style={{
        width: "180px",
        minWidth: "180px",
        borderRight: "1px solid black",
        padding: "32px 0",
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
          padding: "0 24px",
          marginBottom: "16px",
          fontWeight: 600,
        }}
      >
        Navigate
      </div>
      {NAV_ITEMS.map((item) => {
        const isActive = currentView === item.view;
        return (
          <button
            type="button"
            key={item.view}
            data-ocid={item.ocid}
            onClick={() => onNavigate(item.view)}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 24px",
              fontSize: "14px",
              fontWeight: isActive ? 700 : 400,
              textAlign: "left",
              background: isActive ? "#000" : "transparent",
              color: isActive ? "#fff" : "#000",
              transition: "background 0.1s",
              cursor: "pointer",
              border: "none",
              width: "100%",
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "#f0f0f0";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "transparent";
              }
            }}
          >
            <span>{item.label}</span>
            {item.shortcut && (
              <span
                style={{
                  fontSize: "10px",
                  color: isActive ? "#ccc" : "#aaa",
                  fontFamily: "monospace",
                  border: `1px solid ${isActive ? "#666" : "#ddd"}`,
                  padding: "1px 4px",
                }}
              >
                {item.shortcut}
              </span>
            )}
          </button>
        );
      })}
      <div style={{ flex: 1 }} />
      {/* Main site link */}
      <a
        href="https://hands-band-archive-ra1.caffeine.xyz/"
        data-ocid="nav.mainsite.link"
        style={{
          display: "block",
          padding: "10px 24px",
          fontSize: "12px",
          fontWeight: 600,
          textDecoration: "none",
          color: "#000",
          borderTop: "1px solid #eee",
          borderBottom: "1px solid #eee",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          background: "transparent",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.background = "#f0f0f0";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.background =
            "transparent";
        }}
      >
        ← Main Page
      </a>
      <div
        style={{
          padding: "16px 24px 24px",
          fontSize: "10px",
          color: "#aaa",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          lineHeight: 1.8,
        }}
      >
        <div>R = Random</div>
        <div>G = Graph</div>
        <div>T = Timeline</div>
        <div>E = Archive</div>
      </div>
    </nav>
  );
}
