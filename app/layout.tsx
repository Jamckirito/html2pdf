import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HTML → PDF · Shutter del Sur",
  description: "Generador de PDF a partir de HTML con Next.js 15",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
