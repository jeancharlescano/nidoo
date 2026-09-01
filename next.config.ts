import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  logging: {
    browserToTerminal: true,
  },
};

module.exports = {
  allowedDevOrigins: ["192.168.1.70"],
};
export default nextConfig;
