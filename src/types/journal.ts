import { z } from "zod";

export type JournalEntry = {
  id: number;
  status: string;
  comment: string;
  dev: string;
  dev_id: number;
  project: string;
  emoji: string;
  project_id: number;
};

export const JournalSchema = z.object({
  id: z.number(),
  status: z.string(),
  comment: z.string(),
  day: z.string(),
  dev: z.string(),
  dev_id: z.number(),
  project: z.string(),
  emoji: z.string(),
  project_id: z.number(),
});

export type Journal = z.infer<typeof JournalSchema>;
export type JournalStore = z.infer<typeof JournalSchema>[];

export const formSchema = z.object({
  id: z.number().optional(),
  dev_id: z.number(),
  status: z.string().min(1),
  comment: z.string(),
  day: z.date(),
  project_id: z.number().transform((v) => (v ? Number(v) : undefined)),
});

export type formType = z.infer<typeof formSchema>;

export const downloadSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
});

export type downloadType = z.infer<typeof downloadSchema>;
