import type { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/site";

// 2026-09-22 public-site audit item. This is a fully public institutional
// site with no logged-in area and nothing to gate — everything is allowed.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
