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
  margin: { top: "10mm", right: "10mm", bottom: "10mm", left: "10mm" },
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

export const defaultQuotation: QuotationData = {
  numeroCotizacion: "COT-0027",
  fecha: "17/03/2026",
  validoHasta: "27/03/2026",
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

export interface GeneratePdfRequest {
  html: string;
  options: PdfOptions;
}
