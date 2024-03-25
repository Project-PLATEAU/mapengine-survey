/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@deck.gl/layers", "@mapbox/tiny-sdf"],
  experimental: {
    esmExternals: "loose",
  },
  output: "export",
  assetPrefix: "/step2/deckgl",
  basePath: "/step2/deckgl",
};

module.exports = nextConfig;
