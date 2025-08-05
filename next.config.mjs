/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true,
  async rewrites() {
    return [
      {
        source: "/v3/payments",
        destination: "https://api.yookassa.ru/v3/payments",
      },
    ];
  },
};

export default nextConfig;
