import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://almarizo.com";
  const now = new Date();
  const routes: { path: string; freq: MetadataRoute.Sitemap[number]["changeFrequency"]; pri: number }[] = [
    { path: "", freq: "weekly", pri: 1 },
    { path: "/servicios", freq: "monthly", pri: 0.9 },
    { path: "/reservar", freq: "monthly", pri: 0.9 },
    { path: "/metodo", freq: "monthly", pri: 0.8 },
    { path: "/galeria", freq: "weekly", pri: 0.8 },
    { path: "/productos", freq: "monthly", pri: 0.7 },
    { path: "/sobre-mi", freq: "monthly", pri: 0.7 },
    { path: "/contacto", freq: "monthly", pri: 0.7 },
    { path: "/consejos", freq: "monthly", pri: 0.6 },
    { path: "/faq", freq: "monthly", pri: 0.6 },
    { path: "/aviso-legal", freq: "yearly", pri: 0.3 },
    { path: "/privacidad", freq: "yearly", pri: 0.3 },
    { path: "/cookies", freq: "yearly", pri: 0.3 },
  ];
  return routes.map((r) => ({
    url: `${base}${r.path}`,
    lastModified: now,
    changeFrequency: r.freq,
    priority: r.pri,
  }));
}
