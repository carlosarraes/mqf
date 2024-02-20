import { z } from "zod";

export type Project = {
  id: number;
  name: string;
  emoji: string;
};

export const projectFormSchema = z.object({
  name: z.string(),
  emoji: z.string().emoji(),
});

export type projectFormType = z.infer<typeof projectFormSchema>;
