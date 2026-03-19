import type { QuotationData, LineItem } from "./types";

function fmt(n: number | ""): string {
  if (n === "" || n === undefined) return "";
  return Number(n).toLocaleString("es-DO", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function lineTotal(item: LineItem): number | "" {
  if (item.cantidad === "" || item.precioUnit === "") return "";
  return Number(item.cantidad) * Number(item.precioUnit);
}

function grandTotal(items: LineItem[]): number {
  return items.reduce((acc, item) => {
    const t = lineTotal(item);
    return acc + (t === "" ? 0 : t);
  }, 0);
}

export function generateHtml(data: QuotationData): string {
  const total = grandTotal(data.items);

  const itemRows = data.items
    .map((item, i) => {
      const tot = lineTotal(item);
      return `
      <tr>
        <td class="tc">${i + 1}</td>
        <td class="code">${item.codigo}</td>
        <td>${item.descripcion}</td>
        <td class="tr">${item.cantidad !== "" ? item.cantidad : ""}</td>
        <td class="tr">${item.precioUnit !== "" ? "RD$" + fmt(item.precioUnit) : ""}</td>
        <td class="tr">${tot !== "" ? "RD$" + fmt(tot) : ""}</td>
      </tr>`;
    })
    .join("\n");

  const notasHtml = data.notas
    .filter(Boolean)
    .map((n) => `<li>${n}</li>`)
    .join("");

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'DM Sans',sans-serif;background:#f4f6f9;color:#1e2d3d;font-size:13px;padding:28px}
    .page{background:#fff;max-width:790px;margin:auto;border-radius:4px;box-shadow:0 4px 24px rgba(26,46,74,.12);overflow:hidden}
    /* Header */
    .hd{background:#1a2e4a;padding:22px 30px;color:#fff}
    .hd-top{display:flex;align-items:center;gap:14px}
    .logo{width:56px;height:56px;background:#c9a84c;border-radius:50%;display:grid;place-items:center;flex-shrink:0}
    .logo-lines{display:flex;flex-direction:column;gap:3px}
    .logo-line{height:3px;background:#1a2e4a;border-radius:2px;width:26px}
    .brand h1{font-size:22px;font-weight:800;letter-spacing:.02em;line-height:1}
    .brand h1 span{color:#c9a84c}
    .brand .sub{font-size:10.5px;color:rgba(255,255,255,.55);margin-top:3px;font-style:italic}
    .brand .contacts{margin-top:7px;display:flex;flex-wrap:wrap;gap:10px}
    .brand .contacts span{font-size:10.5px;color:rgba(255,255,255,.6)}
    /* Title band */
    .band{background:#c9a84c;padding:9px 30px;display:flex;justify-content:space-between;align-items:center}
    .band h2{font-size:16px;font-weight:800;color:#1a2e4a;letter-spacing:.1em;text-transform:uppercase}
    .band .num{font-size:12px;font-weight:700;color:#1a2e4a;opacity:.65}
    /* Meta */
    .meta{display:grid;grid-template-columns:1fr 1fr;border-bottom:1px solid #dce3ec}
    .mc{padding:9px 30px;border-right:1px solid #dce3ec;border-bottom:1px solid #dce3ec;display:flex;gap:8px;align-items:baseline}
    .mc:nth-child(even){border-right:none}
    .ml{font-size:9.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#6b7d8f;min-width:76px;flex-shrink:0}
    .mv{font-size:13px;font-weight:500}
    /* Table */
    .tw{padding:22px 30px 0}
    table{width:100%;border-collapse:collapse}
    thead tr{background:#1a2e4a}
    thead th{padding:9px 11px;font-size:9.5px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:#f0d98a;text-align:left}
    .tr{text-align:right!important}
    .tc{text-align:center!important;width:34px;color:#6b7d8f}
    .code{font-weight:700;font-size:11px;color:#1a2e4a}
    tbody tr{border-bottom:1px solid #dce3ec}
    tbody tr:last-child{border-bottom:none}
    tbody td{padding:9px 11px;font-size:12.5px}
    /* Totals */
    .tot-area{padding:16px 30px 0;display:flex;justify-content:flex-end}
    .tot-box{border:1px solid #dce3ec;border-radius:4px;overflow:hidden;width:230px}
    .tot-row{display:flex;justify-content:space-between;padding:8px 14px;border-bottom:1px solid #dce3ec;font-size:13px}
    .tot-row:last-child{border:none;background:#1a2e4a}
    .tot-row:last-child .tl,.tot-row:last-child .tv{color:#fff;font-weight:700;font-size:14px}
    .tot-row:last-child .tv{color:#f0d98a}
    .tl{color:#6b7d8f;font-weight:500}
    /* Conditions */
    .cond{padding:14px 30px 0;font-size:12px;color:#6b7d8f;font-style:italic}
    .cond strong{color:#1e2d3d;font-style:normal}
    /* Notes */
    .notes{margin:18px 30px 0;background:#e8f0fb;border-left:4px solid #c9a84c;padding:12px 15px;border-radius:0 4px 4px 0}
    .nt{font-size:9.5px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#1a2e4a;margin-bottom:6px}
    .notes ul{list-style:none}
    .notes li{font-size:12px;margin-bottom:4px;display:flex;gap:6px}
    .notes li::before{content:'•';color:#c9a84c;flex-shrink:0}
    /* Sigs */
    .sigs{display:grid;grid-template-columns:1fr 1fr;gap:20px;padding:26px 30px 32px}
    .sig-line{border-bottom:1.5px solid #1a2e4a;height:30px}
    .sig-lbl{margin-top:5px;font-size:11px;color:#6b7d8f;font-weight:500}
    /* Footer */
    .ft{background:#1a2e4a;padding:10px 30px;display:flex;justify-content:space-between;align-items:center}
    .ft span{font-size:10px;color:rgba(255,255,255,.4)}
    .badge{background:rgba(201,168,76,.15);border:1px solid #c9a84c;color:#f0d98a;border-radius:20px;padding:2px 11px;font-size:10px}
  </style>
</head>
<body>
<div class="page">

  <div class="hd">
    <div class="hd-top">
      <div class="logo"><div class="logo-lines"><div class="logo-line"></div><div class="logo-line" style="width:20px"></div><div class="logo-line"></div></div></div>
      <div class="brand">
        <h1>${data.empresa.replace("EPD", "<span>EPD</span>")}</h1>
        <p class="sub">${data.empresaSubtitulo}</p>
        <div class="contacts">
          <span>📞 ${data.empresaTelefono}</span>
          <span>✉ ${data.empresaEmail}</span>
          <span>🌐 ${data.empresaWeb}</span>
        </div>
      </div>
    </div>
  </div>

  <div class="band">
    <h2>Cotización</h2>
    <span class="num">${data.numeroCotizacion}</span>
  </div>

  <div class="meta">
    <div class="mc"><span class="ml">N° Cotización</span><span class="mv">${data.numeroCotizacion}</span></div>
    <div class="mc"><span class="ml">Cliente</span><span class="mv">${data.cliente || "—"}</span></div>
    <div class="mc"><span class="ml">Fecha</span><span class="mv">${data.fecha}</span></div>
    <div class="mc"><span class="ml">Dirección</span><span class="mv">${data.direccion || "—"}</span></div>
    <div class="mc"><span class="ml">Válido hasta</span><span class="mv">${data.validoHasta}</span></div>
    <div class="mc"><span class="ml">Teléfono</span><span class="mv">${data.telefono || "—"}</span></div>
    <div class="mc"><span class="ml">Vendedor</span><span class="mv">${data.vendedor || "—"}</span></div>
    <div class="mc"><span class="ml">Correo</span><span class="mv">${data.correo || "—"}</span></div>
  </div>

  <div class="tw">
    <table>
      <thead>
        <tr>
          <th class="tc">#</th>
          <th>Código</th>
          <th>Descripción del Producto / Servicio</th>
          <th class="tr">Cant.</th>
          <th class="tr">Precio Unit.</th>
          <th class="tr">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemRows}
      </tbody>
    </table>
  </div>

  <div class="tot-area">
    <div class="tot-box">
      <div class="tot-row">
        <span class="tl">TOTAL</span>
        <span class="tv">RD$${fmt(total)}</span>
      </div>
    </div>
  </div>

  ${data.condiciones ? `<div class="cond">Condiciones de pago: <strong>${data.condiciones}</strong></div>` : ""}

  ${notasHtml ? `
  <div class="notes">
    <div class="nt">Notas / Términos</div>
    <ul>${notasHtml}</ul>
  </div>` : ""}

  <div class="sigs">
    <div><div class="sig-line"></div><p class="sig-lbl">Firma del Cliente</p></div>
    <div><div class="sig-line"></div><p class="sig-lbl">Firma Autorizada</p></div>
  </div>

  <div class="ft">
    <span>© 2026 ${data.empresa} — República Dominicana</span>
    <span class="badge">Válido hasta ${data.validoHasta}</span>
  </div>

</div>
</body>
</html>`;
}
