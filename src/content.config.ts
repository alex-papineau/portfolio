import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

const projects = defineCollection({
	// Load Markdown and MDX files in the `src/content/projects/` directory.
	loader: glob({ base: "./src/content/projects", pattern: "**/*.{md,mdx}" }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		category: z.enum(["professional", "fun"]),
		order: z.number().default(99),
		tags: z.array(z.string()).default([]),
		link: z.string().optional(),
		github: z.string().optional(),
		pubDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
		featured: z.boolean().default(false),
	}),
});

export const collections = { projects };

