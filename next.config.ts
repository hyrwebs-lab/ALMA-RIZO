import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @libsql/client has native bindings — keep it external so it isn't bundled.
  serverExternalPackages: ["@libsql/client"],
};

export default nextConfig;
