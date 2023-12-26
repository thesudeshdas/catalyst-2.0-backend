import { z } from 'zod';

export const registerUserSchema = z.object({
  name: z
    .string({
      required_error: 'Name is required',
    })
    .min(2, { message: 'Name must be at least 2 characters long' })
    .max(32, { message: 'Name must be less than 32 characters long' }),
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Email is not a valid email address')
    .min(2, { message: 'Email must be at least 3 characters long' })
    .max(32, { message: 'Email must be less than 320 characters long' }),
  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(8, 'Password must be at least 8 characters long')
    .max(32, 'Password must be at max 32 characters long')
    .refine(
      (password) => {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]+$/.test(
          password,
        );
      },
      {
        message:
          'Password must be 8-32 characters, with at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*()_+).',
      },
    ),
  refreshToken: z.string().optional(),
});

export type RegisterUserDto = z.infer<typeof registerUserSchema>;

export type UpdateUserDto = Partial<z.infer<typeof registerUserSchema>>;
