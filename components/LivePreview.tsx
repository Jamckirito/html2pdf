"use client";

import { useEffect, useRef, useState } from "react";
import { Monitor, Smartphone, Tablet } from "lucide-react";

interface LivePreviewProps {
  html: string;
}

const VIEWPORTS = [
  { id: "desktop", icon: Monitor, label: "Desktop", width: "100%" },
  { id: "tablet", icon: Tablet, label: "Tablet", width: "768px" },
  { id: "mobile", icon: Smartphone, label: "Mobile", width: "390px" },
] as const;

type ViewportId = (typeof VIEWPORTS)[number]["id"];

export default function LivePreview({ html }: LivePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [viewport, setViewport] = useState<ViewportId>("desktop");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument;
    if (!doc) return;
    doc.open();
    doc.write(html);
    doc.close();
  }, [html, refreshKey]);

  const activeVp = VIEWPORTS.find((v) => v.id === viewport)!;

  return (
    <div className="preview-wrap">
      {/* Preview header */}
      <div className="preview-bar">
        <span className="preview-label">Vista previa</span>
        <div className="viewport-switcher">
          {VIEWPORTS.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              className={`vp-btn ${viewport === id ? "active" : ""}`}
              onClick={() => setViewport(id)}
              title={label}
            >
              <Icon size={14} />
            </button>
          ))}
        </div>
        <button
          className="refresh-btn"
          onClick={() => setRefreshKey((k) => k + 1)}
          title="Refrescar preview"
        >
          ↺
        </button>
      </div>

      {/* Iframe container */}
      <div className="preview-stage">
        <div className="preview-frame-wrap" style={{ maxWidth: activeVp.width }}>
          <iframe
            key={refreshKey}
            ref={iframeRef}
            title="HTML Preview"
            className="preview-iframe"
            sandbox="allow-same-origin allow-scripts"
          />
        </div>
      </div>

      <style jsx>{`
        .preview-wrap {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: #1e2430;
          overflow: hidden;
        }
        .preview-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 4px 12px;
          background: var(--surface);
          border-bottom: 1px solid var(--border);
          flex-shrink: 0;
        }
        .preview-label {
          font-family: var(--mono);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: var(--muted);
          flex: 1;
        }
        .viewport-switcher {
          display: flex;
          gap: 2px;
          background: var(--panel);
          border: 1px solid var(--border);
          border-radius: 4px;
          padding: 2px;
        }
        .vp-btn {
          background: transparent;
          border: none;
          color: var(--muted);
          cursor: pointer;
          padding: 4px 7px;
          border-radius: 3px;
          display: flex;
          align-items: center;
          transition: all .15s;
        }
        .vp-btn:hover { color: var(--text); }
        .vp-btn.active {
          background: var(--amber);
          color: #0d0f12;
        }
        .refresh-btn {
          background: transparent;
          border: 1px solid var(--border);
          color: var(--muted);
          cursor: pointer;
          padding: 3px 9px;
          border-radius: 4px;
          font-size: 15px;
          line-height: 1;
          transition: all .15s;
        }
        .refresh-btn:hover { color: var(--text); border-color: var(--border-hi); }

        .preview-stage {
          flex: 1;
          overflow: auto;
          display: flex;
          justify-content: center;
          padding: 20px;
          background: #181b22;
          background-image:
            radial-gradient(circle, rgba(255,255,255,.04) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        .preview-frame-wrap {
          width: 100%;
          transition: max-width .3s cubic-bezier(.22,1,.36,1);
          box-shadow: 0 8px 40px rgba(0,0,0,.5);
          border-radius: 6px;
          overflow: hidden;
          background: white;
        }
        .preview-iframe {
          width: 100%;
          min-height: 600px;
          height: 100%;
          border: none;
          display: block;
        }
      `}</style>
    </div>
  );
}
