import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://roope.beauty";

  const routes = [
    { url: "", changeFrequency: "daily" as const, priority: 1.0 },
    { url: "/services", changeFrequency: "daily" as const, priority: 0.9 },
    { url: "/bridal", changeFrequency: "weekly" as const, priority: 0.9 },
    { url: "/artists", changeFrequency: "weekly" as const, priority: 0.8 },
    { url: "/gallery", changeFrequency: "weekly" as const, priority: 0.8 },
    { url: "/reviews", changeFrequency: "daily" as const, priority: 0.8 },
    { url: "/events", changeFrequency: "monthly" as const, priority: 0.7 },
    { url: "/contact", changeFrequency: "monthly" as const, priority: 0.6 },
    { url: "/careers", changeFrequency: "monthly" as const, priority: 0.5 },
    { url: "/cancellation-policy", changeFrequency: "monthly" as const, priority: 0.3 },
    { url: "/privacy", changeFrequency: "monthly" as const, priority: 0.3 },
    { url: "/terms", changeFrequency: "monthly" as const, priority: 0.3 },
    { url: "/cookies", changeFrequency: "monthly" as const, priority: 0.3 },
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route.url}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
