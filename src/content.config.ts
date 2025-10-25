import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const news = defineCollection({
  loader: glob({
    pattern: 'news/*.{md,mdx}',
    base: './src/content',
  }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
  }),
});

const holiday = defineCollection({
  loader: glob({
    pattern: 'holiday/*.{md,mdx}',
    base: './src/content',
  }),
  schema: z.object({
    title: z.string(),
    image: z.string().optional(),
    start_date: z.date(),
    end_date: z.date(),
  }),
});

const file = defineCollection({
  loader: glob({
    pattern: 'file/*.{md,mdx}',
    base: './src/content',
  }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    attachments: z.array(z.string()).optional(),
  }),
});

export const collections = { news, holiday, file };
