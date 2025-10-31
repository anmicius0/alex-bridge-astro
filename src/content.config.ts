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
    photos: z.array(z.string()).optional(),
    image: z.string().optional(),
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
    startDate: z.date(),
    endDate: z.date(),
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

const quiz = defineCollection({
  loader: glob({
    pattern: 'quiz/*.{md,mdx}',
    base: './src/content',
  }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    choices: z.array(
      z.object({
        choiceText: z.string(),
        isCorrect: z.boolean(),
      })
    ),
    explanation: z.string(),
  }),
});

export const collections = { news, holiday, file, quiz };
