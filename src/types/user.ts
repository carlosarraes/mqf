import { z } from "zod";

export type Dev = {
  id: number;
  name: string;
};

export const devFormSchema = z.object({
  name: z.string(),
});

export type devFormType = z.infer<typeof devFormSchema>;
