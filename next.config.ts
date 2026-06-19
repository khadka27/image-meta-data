import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  serverExternalPackages: ["exiftool-vendored", "sharp"],
};

export default nextConfig;
