import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Puppeteer needs to run in Node.js runtime (not Edge)
  serverExternalPackages: ["puppeteer"],
};

export default nextConfig;
