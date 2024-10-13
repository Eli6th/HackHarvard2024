/** @type {import('next').NextConfig} */

await import("./env.mjs");

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  }
};



export default nextConfig;
