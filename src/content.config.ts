import { defineCollection, z } from "astro:content";

const posts = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.coerce.date().optional()
  })
});

const calculators = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    slug: z.string().optional()
  })
});

export const collections = {
  posts,
  calculators
};
