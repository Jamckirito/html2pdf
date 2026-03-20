"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import Toolbar from "@/components/Toolbar";
import { createDefaultQuotation, defaultPdfOptions, type PdfOptions, type QuotationData } from "@/lib/types";
import { generateHtml } from "@/lib/generateHtml";

const QuotationForm = dynamic(() => import("@/components/QuotationForm"), { ssr: false });
const LivePreview   = dynamic(() => import("@/components/LivePreview"),   { ssr: false });

export default function Home() {
  const [formData, setFormData]   = useState<QuotationData>(() => createDefaultQuotation());
  const [html, setHtml]           = useState("");
  const [options, setOptions]     = useState<PdfOptions>(defaultPdfOptions);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(true);

  // Re-generate HTML whenever form data changes
  useEffect(() => {
    setHtml(generateHtml(formData));
  }, [formData]);

  const handleGenerate = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html, options }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `${options.filename || "cotizacion"}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [html, options]);

  const handleReset = useCallback(() => {
    setFormData(createDefaultQuotation());
    setOptions(defaultPdfOptions);
    setShowPreview(true);
    setError(null);
  }, []);

  return (
    <div className="app">
      <Toolbar
        options={options}
        onChange={setOptions}
        onGenerate={handleGenerate}
        onReset={handleReset}
        showPreview={showPreview}
        onTogglePreview={() => setShowPreview((v) => !v)}
        loading={loading}
        error={error}
      />

      <main className="workspace">
        {/* Form pane */}
        <section className="pane pane-form">
          <div className="pane-header">
            <span className="pane-dot red" />
            <span className="pane-dot yellow" />
            <span className="pane-dot green" />
            <span className="pane-title">cotizacion.form</span>
          </div>
          <div className="pane-content">
            <QuotationForm data={formData} onChange={setFormData} />
          </div>
        </section>

        {/* Preview pane */}
        {showPreview && (
          <section className="pane pane-preview">
            <div className="pane-header">
              <span className="pane-dot red" />
              <span className="pane-dot yellow" />
              <span className="pane-dot green" />
              <span className="pane-title">preview · live</span>
            </div>
            <div className="pane-content">
              <LivePreview html={html} />
            </div>
          </section>
        )}
      </main>

      {error && (
        <div className="toast toast-error">
          <strong>⚠ Error:</strong> {error}
          <button className="toast-close" onClick={() => setError(null)}>✕</button>
        </div>
      )}

      <style jsx>{`
        .app { display:flex; flex-direction:column; height:100vh; overflow:hidden; }

        .workspace {
          flex:1; display:flex; overflow:hidden;
          gap:1px; background:var(--border);
        }

        .pane {
          display:flex; flex-direction:column;
          flex:1; min-width:0; overflow:hidden;
          background:var(--panel);
        }
        .pane-form { flex: 0 0 420px; }

        .pane-header {
          display:flex; align-items:center; gap:6px;
          padding:8px 14px;
          background:var(--surface);
          border-bottom:1px solid var(--border);
          flex-shrink:0;
        }
        .pane-dot { width:10px; height:10px; border-radius:50%; }
        .pane-dot.red    { background:#ff5f57; }
        .pane-dot.yellow { background:#febc2e; }
        .pane-dot.green  { background:#28c840; }
        .pane-title {
          font-family:var(--mono); font-size:11px;
          color:var(--muted); margin-left:4px;
        }
        .pane-content { flex:1; overflow:hidden; display:flex; flex-direction:column; }

        /* Toast */
        .toast {
          position:fixed; bottom:24px; left:50%; transform:translateX(-50%);
          display:flex; align-items:center; gap:10px;
          padding:12px 18px; border-radius:8px;
          font-family:var(--mono); font-size:13px;
          box-shadow:0 8px 32px rgba(0,0,0,.4);
          animation:slideUp .3s cubic-bezier(.22,1,.36,1);
          z-index:100; max-width:500px;
        }
        .toast-error {
          background:#2d1515; border:1px solid rgba(224,82,82,.4); color:#fca5a5;
        }
        .toast-close {
          background:transparent; border:none; color:inherit;
          cursor:pointer; font-size:14px; opacity:.6; margin-left:4px;
        }
        .toast-close:hover { opacity:1; }
        @keyframes slideUp {
          from { opacity:0; transform:translateX(-50%) translateY(16px); }
          to   { opacity:1; transform:translateX(-50%) translateY(0); }
        }

        @media (max-width:900px) {
          .app {
            height: auto;
            min-height: 100dvh;
            overflow: visible;
          }
          .workspace {
            flex-direction: column;
            overflow: visible;
          }
          .pane {
            overflow: visible;
            min-height: 0;
          }
          .pane-form {
            flex: 0 0 auto;
          }
          .pane-content {
            overflow: visible;
          }
          .pane-preview {
            min-height: 60dvh;
          }
          .toast {
            left: 12px;
            right: 12px;
            bottom: 12px;
            transform: none;
            max-width: none;
          }
        }
      `}</style>
    </div>
  );
}
