export type PaperFormat = "A4" | "A3" | "A5" | "Letter" | "Legal" | "Tabloid";
export type PageOrientation = "portrait" | "landscape";

export interface PdfOptions {
  format: PaperFormat;
  orientation: PageOrientation;
  margin: { top: string; right: string; bottom: string; left: string };
  filename: string;
  printBackground: boolean;
  scale: number;
}

export const defaultPdfOptions: PdfOptions = {
  format: "A4",
  orientation: "portrait",
  margin: { top: "0mm", right: "0mm", bottom: "0mm", left: "0mm" },
  filename: "cotizacion",
  printBackground: true,
  scale: 1,
};

export interface LineItem {
  id: string;
  codigo: string;
  descripcion: string;
  cantidad: number | "";
  precioUnit: number | "";
}

export interface QuotationData {
  numeroCotizacion: string;
  fecha: string;
  validoHasta: string;
  vendedor: string;
  cliente: string;
  direccion: string;
  telefono: string;
  correo: string;
  items: LineItem[];
  condiciones: string;
  notas: string[];
  empresa: string;
  empresaSubtitulo: string;
  empresaTelefono: string;
  empresaEmail: string;
  empresaWeb: string;
}

function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear());
  return `${day}/${month}/${year}`;
}

function addDays(baseDate: Date, days: number): Date {
  const result = new Date(baseDate);
  result.setDate(result.getDate() + days);
  return result;
}

function pad2(value: number): string {
  return String(value).padStart(2, "0");
}

function buildQuotationNumber(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = pad2(date.getMonth() + 1);
  const dd = pad2(date.getDate());
  const hh = pad2(date.getHours());
  const min = pad2(date.getMinutes());
  const ss = pad2(date.getSeconds());
  return `COT-${yyyy}${mm}${dd}-${hh}${min}${ss}`;
}

export function createDefaultQuotation(): QuotationData {
  const now = new Date();
  return {
    numeroCotizacion: buildQuotationNumber(now),
    fecha: formatDate(now),
    validoHasta: formatDate(addDays(now, 10)),
    vendedor: "Esmerlin Portes",
    cliente: "Suriel",
    direccion: "",
    telefono: "829-443-5219",
    correo: "",
    items: [
      { id: "1", codigo: "PP001", descripcion: "Permas", cantidad: 1, precioUnit: "" },
      { id: "2", codigo: "PP001", descripcion: "Permas", cantidad: 1, precioUnit: "" },
      { id: "3", codigo: "PP001", descripcion: "Permas", cantidad: 1, precioUnit: "" },
      { id: "4", codigo: "PP001", descripcion: "Permas", cantidad: 1, precioUnit: "" },
      { id: "5", codigo: "PP001", descripcion: "Permas", cantidad: 1, precioUnit: "" },
      { id: "6", codigo: "PP001", descripcion: "Permas", cantidad: "", precioUnit: "" },
    ],
    condiciones: "Transferencia / Efectivo",
    notas: [
      "Esta cotización es válida por 10 días a partir de la fecha de emisión.",
      "El tiempo de entrega se confirmará al momento de la orden.",
    ],
    empresa: "SHUTTER DEL SUR",
    empresaSubtitulo: "EPD · Tu seguridad es nuestro compromiso",
    empresaTelefono: "+1 849-653-3941",
    empresaEmail: "info@shutterdelsur.com",
    empresaWeb: "www.shutterdelsurepd.com",
  };
}

export const defaultQuotation: QuotationData = createDefaultQuotation();

export interface GeneratePdfRequest {
  html: string;
  options: PdfOptions;
}
