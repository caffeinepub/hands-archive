import { useCallback, useEffect, useState } from "react";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import type { ViewName } from "./components/Sidebar";
import type { ArchiveItem } from "./data";
import { ALL_ITEMS } from "./data";
import { ArchiveView } from "./views/ArchiveView";
import { DetailView } from "./views/DetailView";
import { GraphView } from "./views/GraphView";
import { HomeView } from "./views/HomeView";
import { MediaView } from "./views/MediaView";
import { MusicView } from "./views/MusicView";
import { ShowsView } from "./views/ShowsView";
import { TimelineView } from "./views/TimelineView";

export default function App() {
  const [currentView, setCurrentView] = useState<ViewName>("home");
  const [selectedItem, setSelectedItem] = useState<ArchiveItem | null>(null);
  const [prevView, setPrevView] = useState<ViewName>("home");

  const navigateTo = useCallback(
    (view: ViewName) => {
      if (view === "random") {
        const item = ALL_ITEMS[Math.floor(Math.random() * ALL_ITEMS.length)];
        setSelectedItem(item);
        setPrevView(currentView);
        setCurrentView("detail");
      } else {
        setCurrentView(view);
        setSelectedItem(null);
      }
    },
    [currentView],
  );

  const openDetail = useCallback(
    (item: ArchiveItem) => {
      setPrevView(currentView);
      setSelectedItem(item);
      setCurrentView("detail");
    },
    [currentView],
  );

  const goBack = useCallback(() => {
    setCurrentView(prevView);
    setSelectedItem(null);
  }, [prevView]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      switch (e.key.toUpperCase()) {
        case "R":
          navigateTo("random");
          break;
        case "G":
          navigateTo("graph");
          break;
        case "T":
          navigateTo("timeline");
          break;
        case "E":
          navigateTo("archive");
          break;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigateTo]);

  const isFullHeight = currentView === "graph";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "#fff",
        color: "#000",
        fontFamily: "'DM Sans', Arial, Helvetica, sans-serif",
        overflow: "hidden",
      }}
    >
      <Header />
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar currentView={currentView} onNavigate={navigateTo} />
        <main
          style={{
            flex: 1,
            overflow: isFullHeight ? "hidden" : "auto",
            height: "100%",
          }}
        >
          {currentView === "home" && <HomeView onSelectItem={openDetail} />}
          {currentView === "music" && <MusicView onSelectItem={openDetail} />}
          {currentView === "archive" && (
            <ArchiveView onSelectItem={openDetail} />
          )}
          {currentView === "shows" && <ShowsView onSelectItem={openDetail} />}
          {currentView === "media" && <MediaView />}
          {currentView === "graph" && <GraphView onSelectItem={openDetail} />}
          {currentView === "timeline" && (
            <TimelineView onSelectItem={openDetail} />
          )}
          {currentView === "detail" && selectedItem && (
            <DetailView
              item={selectedItem}
              onBack={goBack}
              onSelectItem={openDetail}
            />
          )}
        </main>
      </div>
    </div>
  );
}
