import { NextRequest, NextResponse } from "next/server";
import { existsSync } from "node:fs";
import type { GeneratePdfRequest } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 30;

const WINDOWS_CHROME_PATHS = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe",
  "C:\\Program Files (x86)\\BraveSoftware\\Brave-Browser\\Application\\brave.exe",
];

async function launchBrowser() {
  const puppeteer = await import("puppeteer");

  const launchArgs = {
    headless: true as const,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
    ],
  };

  try {
    return await puppeteer.default.launch(launchArgs);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const missingBundledChrome =
      message.includes("Could not find Chrome") || message.includes("Browser was not found");
    if (!missingBundledChrome) {
      throw err;
    }

    for (const executablePath of WINDOWS_CHROME_PATHS) {
      if (!existsSync(executablePath)) continue;
      try {
        return await puppeteer.default.launch({ ...launchArgs, executablePath });
      } catch {
        // try next installed browser path
      }
    }

    throw new Error(
      "No se encontro Chrome para generar PDF. Instala el navegador de Puppeteer con `npx puppeteer browsers install chrome` o instala Google Chrome en el sistema."
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: GeneratePdfRequest = await req.json();
    const { html, options } = body;
    const requestOrigin = req.nextUrl.origin;

    if (!html?.trim()) {
      return NextResponse.json(
        { error: "El HTML no puede estar vacío." },
        { status: 400 }
      );
    }

    const browser = await launchBrowser();

    const page = await browser.newPage();

    // Set content and wait for fonts / network resources.
    // Inject a base URL so assets from /public (e.g. /ISOTIPO.png) resolve correctly.
    const htmlWithBase = html.includes("<base ")
      ? html
      : html.replace("<head>", `<head><base href="${requestOrigin}/">`);
    await page.setContent(htmlWithBase, { waitUntil: "networkidle0", timeout: 15000 });

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

    const pdfBuffer = Buffer.from(pdf);
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}.pdf"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
  } catch (err) {
    console.error("[generate-pdf]", err);
    const message = err instanceof Error ? err.message : "";
    return NextResponse.json(
      {
        error:
          message ||
          "Error generando el PDF. Verifica el HTML e intenta de nuevo.",
      },
      { status: 500 }
    );
  }
}
