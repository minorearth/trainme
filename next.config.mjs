/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true,
  async headers() {
    return [
      {
        source: "/pyodide/pyodide.asm.wasm", // путь к вашему wasm файлу
        headers: [
          {
            key: "Cache-Control",
            // value: "no-store",
            value: "public, max-age=31536000, immutable", // кешировать 1 год
          },
        ],
      },
    ];
  },
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
