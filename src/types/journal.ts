import { z } from "zod";

export type JournalEntry = {
  id: number;
  title: string;
  comment: string;
  dev: string;
  dev_id: number;
  project: string;
  project_id: number;
};

export const JournalSchema = z.object({
  id: z.number(),
  title: z.string(),
  comment: z.string(),
  day: z.string(),
  dev: z.string(),
  dev_id: z.number(),
  project: z.string(),
  project_id: z.number(),
});

export type Journal = z.infer<typeof JournalSchema>;
export type JournalStore = z.infer<typeof JournalSchema>[];
