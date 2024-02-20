import { z } from "zod";

export type User = {
  id: number;
  name: string;
};

export const userFormSchema = z.object({
  name: z.string(),
});

export type userFormType = z.infer<typeof userFormSchema>;
