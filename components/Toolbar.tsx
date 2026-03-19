"use client";

import { Download, Eye, EyeOff, RefreshCw, Settings2, FileText } from "lucide-react";
import type { PdfOptions, PaperFormat, PageOrientation } from "@/lib/types";

interface ToolbarProps {
  options: PdfOptions;
  onChange: (o: PdfOptions) => void;
  onGenerate: () => void;
  onReset: () => void;
  showPreview: boolean;
  onTogglePreview: () => void;
  loading: boolean;
  error: string | null;
}

const FORMATS: PaperFormat[] = ["A4", "A3", "A5", "Letter", "Legal", "Tabloid"];
const ORIENTATIONS: { value: PageOrientation; label: string }[] = [
  { value: "portrait", label: "Vertical" },
  { value: "landscape", label: "Horizontal" },
];

export default function Toolbar({
  options,
  onChange,
  onGenerate,
  onReset,
  showPreview,
  onTogglePreview,
  loading,
  error,
}: ToolbarProps) {
  const update = (partial: Partial<PdfOptions>) =>
    onChange({ ...options, ...partial });

  const updateMargin = (side: keyof PdfOptions["margin"], val: string) =>
    onChange({ ...options, margin: { ...options.margin, [side]: val } });

  return (
    <header className="toolbar">
      {/* Brand */}
      <div className="toolbar-brand">
        <FileText size={18} className="brand-icon" />
        <span className="brand-name">HTML<span className="brand-arrow">→</span>PDF</span>
      </div>

      {/* Controls */}
      <div className="toolbar-controls">
        {/* Filename */}
        <label className="ctrl-group">
          <span className="ctrl-label">Archivo</span>
          <input
            className="ctrl-input"
            value={options.filename}
            onChange={(e) => update({ filename: e.target.value })}
            placeholder="documento"
          />
        </label>

        {/* Format */}
        <label className="ctrl-group">
          <span className="ctrl-label">Formato</span>
          <select
            className="ctrl-select"
            value={options.format}
            onChange={(e) => update({ format: e.target.value as PaperFormat })}
          >
            {FORMATS.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </label>

        {/* Orientation */}
        <label className="ctrl-group">
          <span className="ctrl-label">Orientación</span>
          <select
            className="ctrl-select"
            value={options.orientation}
            onChange={(e) => update({ orientation: e.target.value as PageOrientation })}
          >
            {ORIENTATIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </label>

        {/* Margins */}
        <div className="ctrl-group">
          <span className="ctrl-label"><Settings2 size={11} style={{ display: "inline" }} /> Márgenes</span>
          <div className="margin-grid">
            {(["top", "right", "bottom", "left"] as const).map((side) => (
              <input
                key={side}
                className="ctrl-input margin-input"
                title={side}
                placeholder={side[0].toUpperCase()}
                value={options.margin[side]}
                onChange={(e) => updateMargin(side, e.target.value)}
              />
            ))}
          </div>
        </div>

        {/* Scale */}
        <label className="ctrl-group">
          <span className="ctrl-label">Escala ({options.scale})</span>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.05"
            className="ctrl-range"
            value={options.scale}
            onChange={(e) => update({ scale: parseFloat(e.target.value) })}
          />
        </label>

        {/* Background */}
        <label className="ctrl-group ctrl-inline">
          <input
            type="checkbox"
            className="ctrl-check"
            checked={options.printBackground}
            onChange={(e) => update({ printBackground: e.target.checked })}
          />
          <span className="ctrl-label">Fondo</span>
        </label>
      </div>

      {/* Actions */}
      <div className="toolbar-actions">
        {error && <span className="error-chip" title={error}>⚠ Error</span>}

        <button className="btn btn-ghost" onClick={onReset} title="Resetear HTML">
          <RefreshCw size={14} />
        </button>

        <button className="btn btn-ghost" onClick={onTogglePreview} title={showPreview ? "Ocultar preview" : "Mostrar preview"}>
          {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>

        <button
          className={`btn btn-primary ${loading ? "loading" : ""}`}
          onClick={onGenerate}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner" />
              Generando…
            </>
          ) : (
            <>
              <Download size={14} />
              Descargar PDF
            </>
          )}
        </button>
      </div>

      <style jsx>{`
        .toolbar {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 0 16px;
          height: 56px;
          background: var(--surface);
          border-bottom: 1px solid var(--border);
          flex-shrink: 0;
          overflow-x: auto;
        }
        .toolbar-brand {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }
        .brand-icon { color: var(--amber); }
        .brand-name {
          font-family: var(--sans);
          font-weight: 800;
          font-size: 15px;
          letter-spacing: .02em;
          color: var(--text);
          white-space: nowrap;
        }
        .brand-arrow { color: var(--amber); margin: 0 2px; }

        .toolbar-controls {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
          min-width: 0;
        }
        .toolbar-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .ctrl-group {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex-shrink: 0;
        }
        .ctrl-inline {
          flex-direction: row;
          align-items: center;
          gap: 6px;
        }
        .ctrl-label {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: var(--muted);
          white-space: nowrap;
          font-family: var(--mono);
        }
        .ctrl-input, .ctrl-select {
          background: var(--panel);
          border: 1px solid var(--border);
          border-radius: 4px;
          color: var(--text);
          font-family: var(--mono);
          font-size: 12px;
          padding: 4px 8px;
          outline: none;
          transition: border-color .15s;
          min-width: 0;
        }
        .ctrl-input:focus, .ctrl-select:focus {
          border-color: var(--amber);
        }
        .ctrl-input { width: 110px; }
        .ctrl-select { width: 90px; cursor: pointer; }
        .margin-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3px;
        }
        .margin-input { width: 52px; font-size: 11px; }

        .ctrl-range {
          width: 70px;
          accent-color: var(--amber);
          cursor: pointer;
        }
        .ctrl-check {
          accent-color: var(--amber);
          cursor: pointer;
          width: 14px;
          height: 14px;
        }

        .error-chip {
          font-size: 11px;
          color: var(--red);
          font-family: var(--mono);
          background: rgba(224,82,82,.1);
          border: 1px solid rgba(224,82,82,.3);
          border-radius: 4px;
          padding: 3px 8px;
          cursor: default;
        }

        .btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          font-family: var(--sans);
          font-weight: 600;
          font-size: 13px;
          transition: all .15s;
          white-space: nowrap;
        }
        .btn-ghost {
          background: transparent;
          color: var(--muted);
          border: 1px solid var(--border);
          padding: 7px 10px;
        }
        .btn-ghost:hover { color: var(--text); border-color: var(--border-hi); }
        .btn-primary {
          background: var(--amber);
          color: #0d0f12;
        }
        .btn-primary:hover:not(:disabled) { background: var(--gold-lt, #f0d98a); }
        .btn-primary:disabled { opacity: .6; cursor: not-allowed; }
        .btn-primary.loading { opacity: .8; }

        .spinner {
          width: 12px;
          height: 12px;
          border: 2px solid rgba(0,0,0,.3);
          border-top-color: #0d0f12;
          border-radius: 50%;
          animation: spin .6s linear infinite;
          flex-shrink: 0;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </header>
  );
}
