import "server-only";
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as db from "./db";
import type { Service, Product, Review, News } from "./site";

// Server-side readers that map DB rows to the public content shapes.
// Used by the public (server) pages so the site reflects admin edits.

export async function getServices(): Promise<Service[]> {
  return (await db.allServices()).map((r: any) => ({
    slug: r.slug,
    name: r.name,
    tagline: r.tagline,
    description: r.description,
    durationMin: r.durationMin,
    price: r.price,
    featured: !!r.featured,
    image: r.image || undefined,
  }));
}

export async function getProducts(): Promise<Product[]> {
  return (await db.allProducts()).map((r: any) => ({
    slug: r.slug,
    name: r.name,
    description: r.description,
    price: r.price,
    image: r.image,
    active: !!r.active,
  }));
}

export async function getReviews(): Promise<Review[]> {
  return (await db.allReviews()).map((r: any) => ({ name: r.name, rating: r.rating, text: r.text, source: r.source || undefined }));
}

export async function getNews(): Promise<News[]> {
  return (await db.allNews()).map((r: any) => ({ tag: r.tag, title: r.title, text: r.text, image: r.image || undefined }));
}

export async function getGallery(): Promise<{ src: string; alt: string; real?: boolean }[]> {
  return (await db.getSetting("gallery")) ?? [];
}

export async function getBeforeAfter(): Promise<{ before: string; after: string; label: string }[]> {
  return (await db.getSetting("beforeAfter")) ?? [];
}
