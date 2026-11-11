import type { NextConfig } from "next";

const API_URL = process.env.API_URL ?? "http://localhost:5000";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // The browser only ever talks to this origin. /api/* is proxied to the
  // Express server, so the httpOnly auth cookie is first-party (no
  // third-party-cookie or CORS problems) and the API URL never ships to the client.
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${API_URL}/api/:path*` }];
  },
};

export default nextConfig;
