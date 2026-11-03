import type { NextConfig } from "next";

const APP_ENV = process.env.APP_ENV ?? process.env.NODE_ENV;

const { parsed: localEnv } = require("dotenv").config({
  path: ".env." + APP_ENV,
});

const nextConfig: NextConfig = {
  env: {
    ...localEnv,
  },
};

export default nextConfig;
