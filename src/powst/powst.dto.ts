import { z } from 'zod';

export const createPowstSchema = z.object({
  title: z
    .string({
      required_error: 'Project title is required',
    })
    .min(2, { message: 'Project title must be at least 2 characters long' })
    .max(32, { message: 'Project title must be less than 32 characters' }),
  description: z
    .string({
      required_error: 'Project description is required',
    })
    .min(50, {
      message: 'Project description must be at least 50 characters long',
    })
    .max(1000, {
      message: 'Project description must be less than 100 characters',
    }),
});

export type CreatePowstDto = z.infer<typeof createPowstSchema>;
