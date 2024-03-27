/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@deck.gl/layers", "@mapbox/tiny-sdf"],
  experimental: {
    esmExternals: "loose",
  },
  output: "export",
  assetPrefix: "/mapengine-survey/step2/deckgl",
  basePath: "/mapengine-survey/step2/deckgl",
};

module.exports = nextConfig;
