"use client";

import { useCallback, useMemo } from "react";
import { Plus, Trash2, Building2, User, Package } from "lucide-react";
import type { QuotationData, LineItem } from "@/lib/types";

interface QuotationFormProps {
  data: QuotationData;
  onChange: (data: QuotationData) => void;
}

let nextId = 100;
const createEmptyItem = (): LineItem => ({
  id: String(nextId++),
  codigo: "",
  descripcion: "",
  cantidad: "",
  precioUnit: "",
});

export default function QuotationForm({ data, onChange }: QuotationFormProps) {
  const set = useCallback(
    (partial: Partial<QuotationData>) => onChange({ ...data, ...partial }),
    [data, onChange]
  );

  // ── Items helpers ──────────────────────────────────────────────
  const updateItem = (id: string, partial: Partial<LineItem>) => {
    set({
      items: data.items.map((it) => (it.id === id ? { ...it, ...partial } : it)),
    });
  };

  const addItem = () => {
    set({ items: [...data.items, createEmptyItem()] });
  };

  const addItemAfter = (id: string) => {
    const index = data.items.findIndex((it) => it.id === id);
    if (index < 0) return;
    const nextItems = [...data.items];
    nextItems.splice(index + 1, 0, createEmptyItem());
    set({ items: nextItems });
  };

  const removeItem = (id: string) => {
    if (data.items.length <= 1) {
      set({ items: [createEmptyItem()] });
      return;
    }
    set({ items: data.items.filter((it) => it.id !== id) });
  };

  // ── Notes helpers ──────────────────────────────────────────────
  const updateNota = (i: number, val: string) => {
    const notas = [...data.notas];
    notas[i] = val;
    set({ notas });
  };

  const addNota = () => set({ notas: [...data.notas, ""] });

  const removeNota = (i: number) => {
    const notas = data.notas.filter((_, idx) => idx !== i);
    set({ notas });
  };

  // ── Computed totals ────────────────────────────────────────────
  const lineTotal = (item: LineItem) =>
    item.cantidad !== "" && item.precioUnit !== ""
      ? Number(item.cantidad) * Number(item.precioUnit)
      : null;

  const grand = useMemo(
    () =>
      data.items.reduce((acc, it) => {
        const t = lineTotal(it);
        return acc + (t ?? 0);
      }, 0),
    [data.items]
  );

  const fmtMoney = (n: number) =>
    n.toLocaleString("es-DO", { minimumFractionDigits: 2 });

  return (
    <div className="form-root">
      {/* ── EMPRESA ────────────────────────────────────── */}
      <section className="section">
        <div className="section-hd">
          <Building2 size={13} />
          <span>Datos de la empresa</span>
        </div>
        <div className="grid-2">
          <Field label="Empresa">
            <input value={data.empresa} onChange={(e) => set({ empresa: e.target.value })} />
          </Field>
          <Field label="Subtítulo / Slogan">
            <input value={data.empresaSubtitulo} onChange={(e) => set({ empresaSubtitulo: e.target.value })} />
          </Field>
          <Field label="Teléfono empresa">
            <input value={data.empresaTelefono} onChange={(e) => set({ empresaTelefono: e.target.value })} />
          </Field>
          <Field label="Email empresa">
            <input type="email" value={data.empresaEmail} onChange={(e) => set({ empresaEmail: e.target.value })} />
          </Field>
          <Field label="Sitio web" className="span-2">
            <input value={data.empresaWeb} onChange={(e) => set({ empresaWeb: e.target.value })} />
          </Field>
        </div>
      </section>

      {/* ── COTIZACIÓN ─────────────────────────────────── */}
      <section className="section">
        <div className="section-hd">
          <Package size={13} />
          <span>Datos de la cotización</span>
        </div>
        <div className="grid-3">
          <Field label="N° Cotización">
            <input value={data.numeroCotizacion} onChange={(e) => set({ numeroCotizacion: e.target.value })} />
          </Field>
          <Field label="Fecha">
            <input value={data.fecha} onChange={(e) => set({ fecha: e.target.value })} placeholder="dd/mm/aaaa" />
          </Field>
          <Field label="Válido hasta">
            <input value={data.validoHasta} onChange={(e) => set({ validoHasta: e.target.value })} placeholder="dd/mm/aaaa" />
          </Field>
          <Field label="Vendedor" className="span-3">
            <input value={data.vendedor} onChange={(e) => set({ vendedor: e.target.value })} />
          </Field>
        </div>
      </section>

      {/* ── CLIENTE ────────────────────────────────────── */}
      <section className="section">
        <div className="section-hd">
          <User size={13} />
          <span>Datos del cliente</span>
        </div>
        <div className="grid-2">
          <Field label="Nombre / Empresa">
            <input value={data.cliente} onChange={(e) => set({ cliente: e.target.value })} />
          </Field>
          <Field label="Dirección">
            <input value={data.direccion} onChange={(e) => set({ direccion: e.target.value })} />
          </Field>
          <Field label="Teléfono">
            <input value={data.telefono} onChange={(e) => set({ telefono: e.target.value })} />
          </Field>
          <Field label="Correo electrónico">
            <input type="email" value={data.correo} onChange={(e) => set({ correo: e.target.value })} />
          </Field>
        </div>
      </section>

      {/* ── ITEMS ──────────────────────────────────────── */}
      <section className="section">
        <div className="section-hd">
          <span>Productos / Servicios</span>
        </div>

        <div className="items-toolbar">
          <div className="items-toolbar-left">
            <button className="add-btn" onClick={addItem}>
              <Plus size={13} /> Agregar línea
            </button>
          </div>

        </div>

        <div className="items-table">
          {/* Header */}
          <div className="items-head">
            <span className="col-num">#</span>
            <span className="col-code">Código</span>
            <span className="col-desc">Descripción</span>
            <span className="col-qty">Cant.</span>
            <span className="col-price">Precio Unit.</span>
            <span className="col-total">Total</span>
            <span className="col-del">Acciones</span>
          </div>

          {/* Rows */}
          {data.items.map((item, i) => {
            const tot = lineTotal(item);
            return (
              <div className="item-row" key={item.id}>
                <span className="col-num row-num">{i + 1}</span>

                <input
                  className="col-code item-input"
                  value={item.codigo}
                  onChange={(e) => updateItem(item.id, { codigo: e.target.value })}
                  placeholder="COD"
                />

                <input
                  className="col-desc item-input"
                  value={item.descripcion}
                  onChange={(e) => updateItem(item.id, { descripcion: e.target.value })}
                  placeholder="Descripción del producto o servicio"
                />

                <input
                  className="col-qty item-input text-right"
                  type="number"
                  min="0"
                  value={item.cantidad}
                  onChange={(e) =>
                    updateItem(item.id, {
                      cantidad: e.target.value === "" ? "" : Number(e.target.value),
                    })
                  }
                  placeholder="0"
                />

                <input
                  className="col-price item-input text-right"
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.precioUnit}
                  onChange={(e) =>
                    updateItem(item.id, {
                      precioUnit: e.target.value === "" ? "" : Number(e.target.value),
                    })
                  }
                  placeholder="0.00"
                />

                <span className="col-total row-total">
                  {tot !== null ? `RD$${fmtMoney(tot)}` : "—"}
                </span>

                <div className="col-del row-actions">
                  <button
                    className="del-btn"
                    onClick={() => addItemAfter(item.id)}
                    title="Insertar fila debajo"
                  >
                    <Plus size={12} />
                  </button>
                  <button
                    className="del-btn del-btn-danger"
                    onClick={() => removeItem(item.id)}
                    title="Eliminar fila"
                  >
                    <Trash2 size={12} />
                    <span>Quitar</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="items-footer">
          <span className="items-count">{data.items.length} líneas</span>
          <div className="grand-total">
            <span className="gt-label">TOTAL</span>
            <span className="gt-value">RD${fmtMoney(grand)}</span>
          </div>
        </div>
      </section>

      {/* ── CONDICIONES ────────────────────────────────── */}
      <section className="section">
        <div className="section-hd"><span>Condiciones y notas</span></div>
        <div className="grid-1">
          <Field label="Condiciones de pago">
            <input
              value={data.condiciones}
              onChange={(e) => set({ condiciones: e.target.value })}
              placeholder="Ej: Transferencia / Efectivo"
            />
          </Field>
        </div>

        <div className="notas-list">
          {data.notas.map((nota, i) => (
            <div className="nota-row" key={i}>
              <span className="nota-bullet">•</span>
              <input
                className="nota-input"
                value={nota}
                onChange={(e) => updateNota(i, e.target.value)}
                placeholder="Escribe una nota o término…"
              />
              <button className="del-btn" onClick={() => removeNota(i)}>
                <Trash2 size={12} />
              </button>
            </div>
          ))}
          <button className="add-btn" onClick={addNota} style={{ marginTop: 6 }}>
            <Plus size={13} /> Agregar nota
          </button>
        </div>
      </section>

      {/* ── STYLES ─────────────────────────────────────── */}
      <style jsx>{`
        .form-root {
          height: 100%;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: var(--bg);
        }

        /* Section card */
        .section {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px;
          overflow: hidden;
        }
        .section-hd {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 9px 14px;
          background: var(--panel);
          border-bottom: 1px solid var(--border);
          font-family: var(--mono);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: var(--amber);
        }

        /* Grids */
        .grid-1 { display: grid; grid-template-columns: 1fr; gap: 10px; padding: 14px; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 14px; }
        .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; padding: 14px; }

        :global(.span-2) { grid-column: span 2; }
        :global(.span-3) { grid-column: span 3; }

        /* Items table */
        .items-table {
          padding: 12px 14px 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
          overflow-x: auto;
        }
        .items-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          padding: 12px 14px 0;
        }
        .items-toolbar-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .items-head {
          display: grid;
          grid-template-columns: 28px 80px 1fr 60px 100px 110px 120px;
          gap: 6px;
          padding: 0 4px 6px;
          border-bottom: 1px solid var(--border);
        }
        .items-head span {
          font-family: var(--mono);
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: .08em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .item-row {
          display: grid;
          grid-template-columns: 28px 80px 1fr 60px 100px 110px 120px;
          gap: 6px;
          align-items: center;
        }
        .row-actions {
          display: flex;
          gap: 6px;
          justify-content: flex-end;
        }
        .row-num {
          font-family: var(--mono);
          font-size: 11px;
          color: var(--muted);
          text-align: center;
        }
        .row-total {
          font-family: var(--mono);
          font-size: 12px;
          font-weight: 600;
          color: var(--amber);
          text-align: right;
        }
        .item-input {
          width: 100%;
          background: var(--panel);
          border: 1px solid var(--border);
          border-radius: 4px;
          color: var(--text);
          font-family: var(--mono);
          font-size: 12px;
          padding: 5px 8px;
          outline: none;
          transition: border-color .15s;
        }
        .item-input:focus { border-color: var(--amber); }
        .item-input::placeholder { color: var(--muted); opacity: .5; }
        .text-right { text-align: right; }

        /* Cols alignment */
        .col-num { text-align: center; }
        .col-qty, .col-price, .col-total { text-align: right; }

        /* Footer */
        .items-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 14px 14px;
        }
        .items-count {
          font-family: var(--mono);
          font-size: 11px;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: .06em;
        }
        .grand-total {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--panel);
          border: 1px solid var(--border-hi);
          border-radius: 6px;
          padding: 8px 14px;
        }
        .gt-label {
          font-family: var(--mono);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .gt-value {
          font-family: var(--mono);
          font-size: 15px;
          font-weight: 700;
          color: var(--amber);
        }

        /* Notas */
        .notas-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 0 14px 14px;
        }
        .nota-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .nota-bullet { color: var(--amber); flex-shrink: 0; font-size: 16px; line-height: 1; }
        .nota-input {
          flex: 1;
          background: var(--panel);
          border: 1px solid var(--border);
          border-radius: 4px;
          color: var(--text);
          font-family: var(--sans);
          font-size: 13px;
          padding: 6px 10px;
          outline: none;
          transition: border-color .15s;
        }
        .nota-input:focus { border-color: var(--amber); }

        /* Shared buttons */
        .add-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 12px;
          background: transparent;
          border: 1px dashed var(--border-hi);
          border-radius: 5px;
          color: var(--muted);
          font-family: var(--sans);
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all .15s;
        }
        .add-btn:hover { color: var(--amber); border-color: var(--amber); }
        .del-btn {
          background: transparent;
          border: 1px solid transparent;
          color: var(--muted);
          cursor: pointer;
          padding: 5px 7px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: all .15s;
        }
        .del-btn:hover:not(:disabled) { color: #e05252; background: rgba(224,82,82,.1); }
        .del-btn-danger {
          color: #f19a9a;
          border-color: rgba(224,82,82,.25);
          background: rgba(224,82,82,.06);
        }
        .del-btn-danger span {
          font-family: var(--mono);
          font-size: 10px;
          letter-spacing: .04em;
          text-transform: uppercase;
        }
        .del-btn-danger:hover:not(:disabled) {
          border-color: rgba(224,82,82,.45);
          background: rgba(224,82,82,.14);
          color: #ffd0d0;
        }
        .del-btn:disabled { opacity: .2; cursor: not-allowed; }

        @media (max-width: 900px) {
          .grid-3 { grid-template-columns: 1fr 1fr; }
          :global(.span-3) { grid-column: span 2; }
        }

        @media (max-width: 700px) {
          .form-root {
            padding: 12px;
          }
          .grid-2,
          .grid-3 {
            grid-template-columns: 1fr;
          }
          :global(.span-2),
          :global(.span-3) {
            grid-column: span 1;
          }
          .items-head {
            display: none;
          }
          .item-row {
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 8px;
            margin-bottom: 6px;
            background: rgba(255, 255, 255, 0.01);
          }
          .col-num {
            grid-column: 1 / -1;
            text-align: left;
            font-weight: 700;
          }
          .col-code,
          .col-desc,
          .col-qty,
          .col-price,
          .col-total,
          .col-del {
            width: 100%;
          }
          .col-desc {
            grid-column: 1 / -1;
          }
          .col-total {
            text-align: left;
            padding: 6px 0 0;
          }
          .row-actions {
            justify-content: flex-start;
          }
          .items-footer {
            flex-direction: column;
            align-items: stretch;
            gap: 10px;
          }
          .items-toolbar {
            flex-direction: column;
            align-items: stretch;
          }
          .items-toolbar-left {
            width: 100%;
          }
          .grand-total {
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
}

/* ── Small Field wrapper ────────────────────────────────────── */
function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`field ${className ?? ""}`}>
      <label className="field-label">{label}</label>
      {children}
      <style jsx>{`
        .field {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .field-label {
          font-family: var(--mono);
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: .08em;
          text-transform: uppercase;
          color: var(--muted);
        }
        :global(.field input) {
          background: var(--panel);
          border: 1px solid var(--border);
          border-radius: 5px;
          color: var(--text);
          font-family: var(--sans);
          font-size: 13px;
          padding: 7px 10px;
          outline: none;
          width: 100%;
          transition: border-color .15s;
        }
        :global(.field input:focus) { border-color: var(--amber); }
        :global(.field input::placeholder) { color: var(--muted); opacity: .5; }
      `}</style>
    </div>
  );
}
