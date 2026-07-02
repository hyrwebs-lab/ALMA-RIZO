import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin"] },
    sitemap: "https://almarizo.com/sitemap.xml",
    host: "https://almarizo.com",
  };
}
