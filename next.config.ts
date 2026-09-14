import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root: unrelated lockfiles higher up the tree confuse inference.
  outputFileTracingRoot: path.join(__dirname),
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "storage.googleapis.com" },
    ],
  },
};

export default nextConfig;
