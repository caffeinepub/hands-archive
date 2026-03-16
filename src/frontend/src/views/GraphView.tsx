import { useCallback, useEffect, useRef, useState } from "react";
import { ALL_ITEMS } from "../data";
import type { ArchiveItem } from "../data";

type GeometryMode = "standard" | "flower" | "hex" | "spiral";

type GraphNode = {
  id: string;
  label: string;
  type: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  fx: number | null;
  fy: number | null;
};

type GraphLink = {
  source: string;
  target: string;
};

type Props = {
  onSelectItem: (item: ArchiveItem) => void;
};

const NODE_COLORS: Record<string, string> = {
  song: "#000",
  album: "#333",
  member: "#777",
  show: "#bbb",
};

const NODE_SIZES: Record<string, number> = {
  song: 7,
  album: 13,
  member: 11,
  show: 7,
};

function buildGraph(
  W: number,
  H: number,
): { nodes: GraphNode[]; links: GraphLink[] } {
  const cx = W / 2;
  const cy = H / 2;
  const nodes: GraphNode[] = ALL_ITEMS.map((item) => ({
    id: item.id,
    label:
      item.type === "member"
        ? (item as { name: string }).name
        : (item as { title: string }).title,
    type: item.type,
    x: cx + (Math.random() - 0.5) * 200,
    y: cy + (Math.random() - 0.5) * 200,
    vx: 0,
    vy: 0,
    fx: null,
    fy: null,
  }));

  const links: GraphLink[] = [];
  for (const item of ALL_ITEMS) {
    if (item.type === "album") {
      for (const songId of item.trackList) {
        links.push({ source: item.id, target: songId });
      }
    }
    if (item.type === "member") {
      for (const album of ALL_ITEMS.filter((i) => i.type === "album")) {
        links.push({ source: item.id, target: album.id });
      }
    }
  }
  return { nodes, links };
}

function tickSimulation(
  nodes: GraphNode[],
  links: GraphLink[],
  W: number,
  H: number,
) {
  const alpha = 0.25;
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  // Spring forces along links
  for (const link of links) {
    const s = nodeMap.get(link.source);
    const t = nodeMap.get(link.target);
    if (!s || !t) continue;
    const dx = t.x - s.x;
    const dy = t.y - s.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const target = 110;
    const f = (dist - target) * 0.008 * alpha;
    const fx = (dx / dist) * f;
    const fy = (dy / dist) * f;
    if (s.fx === null) {
      s.vx += fx;
      s.vy += fy;
    }
    if (t.fx === null) {
      t.vx -= fx;
      t.vy -= fy;
    }
  }

  // Repulsion + centering
  const cx = W / 2;
  const cy = H / 2;
  for (const n of nodes) {
    if (n.fx !== null) continue;
    // Gravity toward center
    n.vx += (cx - n.x) * 0.001 * alpha;
    n.vy += (cy - n.y) * 0.001 * alpha;
    // Repulsion
    for (const m of nodes) {
      if (n === m) continue;
      const dx = n.x - m.x;
      const dy = n.y - m.y;
      const dist2 = dx * dx + dy * dy || 1;
      const f = (3500 * alpha) / dist2;
      n.vx += dx * f;
      n.vy += dy * f;
    }
  }

  // Integrate
  for (const n of nodes) {
    if (n.fx !== null) {
      n.x = n.fx;
      n.y = n.fy!;
      n.vx = 0;
      n.vy = 0;
    } else {
      n.vx *= 0.85;
      n.vy *= 0.85;
      n.x += n.vx;
      n.y += n.vy;
    }
  }
}

function fitNodesToView(
  nodes: GraphNode[],
  W: number,
  H: number,
  padding = 60,
): { x: number; y: number; k: number } {
  if (nodes.length === 0) return { x: 0, y: 0, k: 1 };
  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;
  for (const n of nodes) {
    const r = (NODE_SIZES[n.type] ?? 7) + 14; // node radius + label space
    minX = Math.min(minX, n.x - r);
    minY = Math.min(minY, n.y - r);
    maxX = Math.max(maxX, n.x + r);
    maxY = Math.max(maxY, n.y + r);
  }
  const graphW = maxX - minX || 1;
  const graphH = maxY - minY || 1;
  const k = Math.min(
    (W - padding * 2) / graphW,
    (H - padding * 2) / graphH,
    1.2, // don't zoom in beyond 1.2x
  );
  const x = W / 2 - ((minX + maxX) / 2) * k;
  const y = H / 2 - ((minY + maxY) / 2) * k;
  return { x, y, k };
}

function applyGeometry(
  nodes: GraphNode[],
  mode: GeometryMode,
  cx: number,
  cy: number,
) {
  if (mode === "flower") {
    const ringDefs = [1, 6, 12];
    let i = 0;
    for (const [ringIdx, count] of ringDefs.entries()) {
      const r = ringIdx * 130;
      for (let j = 0; j < count && i < nodes.length; j++, i++) {
        const angle = (j / Math.max(1, count)) * Math.PI * 2 - Math.PI / 2;
        nodes[i].fx = cx + r * Math.cos(angle);
        nodes[i].fy = cy + r * Math.sin(angle);
      }
    }
    for (; i < nodes.length; i++) {
      const angle = (i / nodes.length) * Math.PI * 2;
      nodes[i].fx = cx + 260 * Math.cos(angle);
      nodes[i].fy = cy + 260 * Math.sin(angle);
    }
  } else if (mode === "hex") {
    const cols = Math.ceil(Math.sqrt(nodes.length));
    const totalRows = Math.ceil(nodes.length / cols);
    const colSpacing = 100;
    const rowSpacing = 88;
    for (const [i, node] of nodes.entries()) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const offset = row % 2 === 0 ? 0 : colSpacing / 2;
      node.fx = cx - (cols * colSpacing) / 2 + col * colSpacing + offset;
      node.fy = cy - (totalRows * rowSpacing) / 2 + row * rowSpacing;
    }
  } else if (mode === "spiral") {
    for (const [i, node] of nodes.entries()) {
      const angle = i * 0.8;
      const r = i * 22;
      node.fx = cx + r * Math.cos(angle);
      node.fy = cy + r * Math.sin(angle);
    }
  } else {
    for (const node of nodes) {
      node.fx = null;
      node.fy = null;
    }
  }
}

export function GraphView({ onSelectItem }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [geometry, setGeometry] = useState<GeometryMode>("standard");
  const geometryRef = useRef<GeometryMode>("standard");

  const hoveredIdRef = useRef<string | null>(null);
  const nodesRef = useRef<GraphNode[]>([]);
  const linksRef = useRef<GraphLink[]>([]);
  const transformRef = useRef({ x: 0, y: 0, k: 1 });
  const sizeRef = useRef({ W: 0, H: 0 });
  const frameRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const runningRef = useRef(false);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const dragNodeRef = useRef<GraphNode | null>(null);
  const hasFitRef = useRef(false); // track if we've auto-fit yet

  // Keep geometry ref in sync
  useEffect(() => {
    geometryRef.current = geometry;
  }, [geometry]);

  const getWorldPos = useCallback(
    (e: MouseEvent, canvas: HTMLCanvasElement) => {
      const rect = canvas.getBoundingClientRect();
      const mx =
        (e.clientX - rect.left - transformRef.current.x) /
        transformRef.current.k;
      const my =
        (e.clientY - rect.top - transformRef.current.y) /
        transformRef.current.k;
      return { mx, my };
    },
    [],
  );

  const findNode = useCallback((mx: number, my: number): GraphNode | null => {
    let found: GraphNode | null = null;
    let minDist = Number.POSITIVE_INFINITY;
    for (const node of nodesRef.current) {
      const dx = node.x - mx;
      const dy = node.y - my;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const r = (NODE_SIZES[node.type] ?? 7) + 5;
      if (dist < r && dist < minDist) {
        minDist = dist;
        found = node;
      }
    }
    return found;
  }, []);

  const startLoop = useCallback(
    (ctx: CanvasRenderingContext2D, _canvas: HTMLCanvasElement) => {
      if (runningRef.current) return;
      runningRef.current = true;

      function draw() {
        const { W, H } = sizeRef.current;
        if (W === 0 || H === 0) return;

        ctx.clearRect(0, 0, W, H);
        ctx.save();
        const { x, y, k } = transformRef.current;
        ctx.translate(x, y);
        ctx.scale(k, k);

        // Draw links
        ctx.strokeStyle = "#ccc";
        ctx.lineWidth = 1 / k;
        const nodeMap = new Map(nodesRef.current.map((n) => [n.id, n]));
        for (const link of linksRef.current) {
          const s = nodeMap.get(link.source);
          const t = nodeMap.get(link.target);
          if (!s || !t) continue;
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(t.x, t.y);
          ctx.stroke();
        }

        // Draw nodes
        for (const node of nodesRef.current) {
          const r = NODE_SIZES[node.type] ?? 7;
          const isHov = node.id === hoveredIdRef.current;
          ctx.fillStyle = isHov ? "#fff" : (NODE_COLORS[node.type] ?? "#000");
          ctx.strokeStyle = "#000";
          ctx.lineWidth = isHov ? 2 / k : 1 / k;
          ctx.beginPath();
          ctx.rect(node.x - r, node.y - r, r * 2, r * 2);
          ctx.fill();
          ctx.stroke();

          const label =
            node.label.length > 16
              ? `${node.label.substring(0, 15)}…`
              : node.label;
          ctx.fillStyle = "#000";
          ctx.font = `${isHov ? "bold " : ""}${10 / k}px 'Space Mono', monospace`;
          ctx.textAlign = "center";
          ctx.fillText(label, node.x, node.y + r + 12 / k);
        }

        ctx.restore();
      }

      function loop() {
        const { W, H } = sizeRef.current;
        if (W > 0 && H > 0) {
          const shouldSimulate =
            frameRef.current < 350 || dragNodeRef.current !== null;
          if (shouldSimulate) {
            tickSimulation(nodesRef.current, linksRef.current, W, H);
            frameRef.current++;

            // Auto-fit once after simulation settles (around frame 300)
            if (
              frameRef.current === 300 &&
              !hasFitRef.current &&
              geometryRef.current === "standard"
            ) {
              hasFitRef.current = true;
              transformRef.current = fitNodesToView(nodesRef.current, W, H);
            }
          }
          draw();
        }
        rafRef.current = requestAnimationFrame(loop);
      }

      rafRef.current = requestAnimationFrame(loop);
      return () => {
        runningRef.current = false;
        if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      };
    },
    [],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let stopLoop: (() => void) | undefined;

    function initSize(W: number, H: number) {
      if (!canvas) return;
      canvas.width = W;
      canvas.height = H;
      sizeRef.current = { W, H };

      if (nodesRef.current.length === 0) {
        const { nodes, links } = buildGraph(W, H);
        nodesRef.current = nodes;
        linksRef.current = links;
        frameRef.current = 0;
        hasFitRef.current = false;
      }

      // Center transform
      transformRef.current = { x: 0, y: 0, k: 1 };

      if (!stopLoop) {
        stopLoop = startLoop(ctx!, canvas!);
      }
    }

    // Try immediate sizing
    const rect = container.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      initSize(Math.floor(rect.width), Math.floor(rect.height));
    }

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          initSize(Math.floor(width), Math.floor(height));
        }
      }
    });
    ro.observe(container);

    // Event handlers
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.1 : 0.9;
      transformRef.current.k = Math.max(
        0.2,
        Math.min(5, transformRef.current.k * factor),
      );
      frameRef.current = Math.min(frameRef.current, 350); // keep drawing
    };

    const onMouseDown = (e: MouseEvent) => {
      const { mx, my } = getWorldPos(e, canvas!);
      const node = findNode(mx, my);
      if (node) {
        dragNodeRef.current = node;
        node.fx = node.x;
        node.fy = node.y;
      } else {
        isDraggingRef.current = true;
        dragStartRef.current = {
          x: e.clientX,
          y: e.clientY,
          tx: transformRef.current.x,
          ty: transformRef.current.y,
        };
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (dragNodeRef.current) {
        const { mx, my } = getWorldPos(e, canvas!);
        dragNodeRef.current.fx = mx;
        dragNodeRef.current.fy = my;
        frameRef.current = 0;
        return;
      }
      if (isDraggingRef.current) {
        transformRef.current.x =
          dragStartRef.current.tx + (e.clientX - dragStartRef.current.x);
        transformRef.current.y =
          dragStartRef.current.ty + (e.clientY - dragStartRef.current.y);
        frameRef.current = Math.min(frameRef.current, 350);
        return;
      }
      const { mx, my } = getWorldPos(e, canvas!);
      const hovered = findNode(mx, my);
      const newId = hovered?.id ?? null;
      if (newId !== hoveredIdRef.current) {
        hoveredIdRef.current = newId;
        canvas!.style.cursor = hovered ? "pointer" : "default";
        frameRef.current = Math.min(frameRef.current, 350);
      }
    };

    const onMouseUp = (e: MouseEvent) => {
      if (dragNodeRef.current) {
        const moved =
          dragNodeRef.current.fx !== null &&
          Math.abs(dragNodeRef.current.fx - dragNodeRef.current.x) < 4 &&
          Math.abs(dragNodeRef.current.fy! - dragNodeRef.current.y) < 4;
        if (moved) {
          const item = ALL_ITEMS.find((i) => i.id === dragNodeRef.current!.id);
          if (item) onSelectItem(item);
        }
        // Release fix
        if (geometryRef.current === "standard") {
          dragNodeRef.current.fx = null;
          dragNodeRef.current.fy = null;
        }
        dragNodeRef.current = null;
        return;
      }
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        return;
      }
      const { mx, my } = getWorldPos(e, canvas!);
      const node = findNode(mx, my);
      if (node) {
        const item = ALL_ITEMS.find((i) => i.id === node.id);
        if (item) onSelectItem(item);
      }
    };

    const onMouseLeave = () => {
      isDraggingRef.current = false;
      if (dragNodeRef.current && geometryRef.current === "standard") {
        dragNodeRef.current.fx = null;
        dragNodeRef.current.fy = null;
      }
      dragNodeRef.current = null;
    };

    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mouseleave", onMouseLeave);

    return () => {
      ro.disconnect();
      if (stopLoop) stopLoop();
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      runningRef.current = false;
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [getWorldPos, findNode, onSelectItem, startLoop]);

  // Apply geometry when mode changes and re-fit view
  useEffect(() => {
    const { W, H } = sizeRef.current;
    if (nodesRef.current.length === 0) return;
    applyGeometry(nodesRef.current, geometry, W / 2, H / 2);
    frameRef.current = 0; // restart simulation ticks so geometry gets drawn
    // For non-standard layouts, fit to view immediately after applying
    if (geometry !== "standard") {
      setTimeout(() => {
        transformRef.current = fitNodesToView(nodesRef.current, W, H);
      }, 100);
    }
  }, [geometry]);

  const geomOptions: { key: GeometryMode; label: string }[] = [
    { key: "standard", label: "Standard" },
    { key: "flower", label: "Flower of Life" },
    { key: "hex", label: "Hex Grid" },
    { key: "spiral", label: "Golden Spiral" },
  ];

  const legend = [
    { type: "album", label: "Album" },
    { type: "song", label: "Song" },
    { type: "member", label: "Member" },
    { type: "show", label: "Show" },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          padding: "12px 20px",
          borderBottom: "1px solid #000",
          display: "flex",
          alignItems: "center",
          gap: "20px",
          flexWrap: "wrap",
          background: "#fff",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontWeight: 700,
            fontSize: "13px",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          Graph View
        </span>

        <div style={{ display: "flex", alignItems: "center" }}>
          <span
            style={{
              fontSize: "10px",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#888",
              marginRight: "8px",
              fontFamily: "'Space Mono', monospace",
            }}
          >
            Geometry
          </span>
          {geomOptions.map((opt, i) => (
            <button
              type="button"
              key={opt.key}
              data-ocid="geometry.toggle"
              onClick={() => setGeometry(opt.key)}
              style={{
                padding: "5px 10px",
                fontSize: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontWeight: 700,
                fontFamily: "'Space Mono', monospace",
                background: geometry === opt.key ? "#000" : "#fff",
                color: geometry === opt.key ? "#fff" : "#000",
                border: "1px solid #000",
                borderLeft: i === 0 ? "1px solid #000" : "none",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            gap: "14px",
            marginLeft: "auto",
            flexWrap: "wrap",
          }}
        >
          {legend.map((l) => (
            <div
              key={l.type}
              style={{ display: "flex", alignItems: "center", gap: "5px" }}
            >
              <div
                style={{
                  width: "11px",
                  height: "11px",
                  background: NODE_COLORS[l.type],
                  border: "1px solid #000",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "#666",
                  fontFamily: "'Space Mono', monospace",
                }}
              >
                {l.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Canvas container */}
      <div
        ref={containerRef}
        style={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
          background: "#fff",
        }}
      >
        <canvas
          ref={canvasRef}
          data-ocid="graph.canvas_target"
          style={{ display: "block", width: "100%", height: "100%" }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "14px",
            left: "14px",
            fontSize: "9px",
            color: "#aaa",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            pointerEvents: "none",
            fontFamily: "'Space Mono', monospace",
          }}
        >
          Scroll to zoom · Drag to pan · Click node to view
        </div>
      </div>
    </div>
  );
}
