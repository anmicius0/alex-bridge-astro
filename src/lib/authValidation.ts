import { z } from 'zod';

// Shared auth validation schema for register/login endpoints
export const authSchema = z.object({
  email: z.string().email({ message: 'Invalid email format' }).trim(),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' })
    .trim(),
});

export type AuthInput = z.infer<typeof authSchema>;
