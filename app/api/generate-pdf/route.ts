import { NextRequest, NextResponse } from "next/server";
import type { GeneratePdfRequest } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const body: GeneratePdfRequest = await req.json();
    const { html, options } = body;

    if (!html?.trim()) {
      return NextResponse.json(
        { error: "El HTML no puede estar vacío." },
        { status: 400 }
      );
    }

    // Dynamic import so puppeteer is only loaded server-side
    const puppeteer = await import("puppeteer");

    const browser = await puppeteer.default.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    });

    const page = await browser.newPage();

    // Set content and wait for fonts / network resources
    await page.setContent(html, { waitUntil: "networkidle0", timeout: 15000 });

    // Build margin object
    const margin = options.margin ?? {
      top: "15mm",
      right: "15mm",
      bottom: "15mm",
      left: "15mm",
    };

    const pdf = await page.pdf({
      format: options.format ?? "A4",
      landscape: options.orientation === "landscape",
      printBackground: options.printBackground ?? true,
      margin,
      scale: options.scale ?? 1,
    });

    await browser.close();

    const filename = encodeURIComponent(options.filename || "documento");

    return new NextResponse(pdf, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}.pdf"`,
        "Content-Length": pdf.length.toString(),
      },
    });
  } catch (err) {
    console.error("[generate-pdf]", err);
    return NextResponse.json(
      { error: "Error generando el PDF. Verifica el HTML e intenta de nuevo." },
      { status: 500 }
    );
  }
}
