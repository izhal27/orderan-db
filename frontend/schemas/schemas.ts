import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(3, 'Username minimal 3 karakter'),
  password: z.string().min(3, 'Password minimal 3 karakter'),
});

export const orderTypeSchema = z.object({
  name: z.string().min(5, 'Nama minimal 5 karakter'),
  description: z.string()
    .min(3, 'Keterangan maksimal 300 karakter')
    .optional()
    .or(z.literal('')),
});
