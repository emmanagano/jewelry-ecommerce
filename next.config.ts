import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  images: {
    // Only these hosts can be optimized by next/image
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com", pathname: "/photos/**" },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  // Products were renamed with the Vaelore rebrand; keep old links working
  async redirects() {
    return [
      { source: "/product/perle-mini-hoops", destination: "/product/lumiere-pearl-huggies", permanent: true },
      { source: "/product/baroque-pearl-flora-pendant", destination: "/product/lumiere-pearl-medallion-necklace", permanent: true },
      { source: "/product/petite-baroque-pearl-choker", destination: "/product/lumiere-pearl-choker", permanent: true },
      { source: "/product/sovereign-tri-tone-filigree-chandeliers", destination: "/product/tide-sculpted-hoops", permanent: true },
      { source: "/product/aurelia-teardrop-pave-drops", destination: "/product/tide-faceted-huggies", permanent: true },
      { source: "/product/luna-moonstone-pendant", destination: "/product/tide-moonstone-pendant", permanent: true },
      { source: "/product/sovereign-emerald-heritage-choker", destination: "/product/tide-sunburst-collar", permanent: true },
      { source: "/product/atelier-multi-gauge-chain-suite", destination: "/product/tide-chain", permanent: true },
      { source: "/product/linea-stacking-ring-set", destination: "/product/tide-stacking-rings", permanent: true },
      { source: "/product/eos-tapered-spear-pave-bangle", destination: "/product/tide-cuff", permanent: true },
      { source: "/product/soleil-fine-chain-bracelet", destination: "/product/tide-chain-bracelet", permanent: true },
      { source: "/product/amour-heart-outline-pendant", destination: "/product/heirloom-pendant", permanent: true },
      { source: "/product/pave-celestial-stacking-trio", destination: "/product/heirloom-solitaire-and-band-set", permanent: true },
      { source: "/product/ouroboros-pave-serpent-bangle", destination: "/product/heirloom-pave-bangle", permanent: true },
      { source: "/product/eterna-diamond-eternity-band", destination: "/product/heirloom-eternity-band", permanent: true },
    ];
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
