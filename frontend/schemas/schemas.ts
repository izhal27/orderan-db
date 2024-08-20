import email from 'next-auth/providers/email';
import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(3, 'Username minimal 3 karakter'),
  password: z.string().min(3, 'Password minimal 3 karakter'),
});

export const orderTypeSchema = z.object({
  name: z.string().min(5, 'Nama minimal 5 karakter'),
  description: z.string()
    .max(300, 'Keterangan maksimal 300 karakter')
    .optional()
    .or(z.literal('')),
});

export const customerSchema = z.object({
  name: z.string().min(3, 'Nama minimal 3 karakter'),
  address: z.string()
    .max(100, 'Keterangan maksimal 100 karakter')
    .optional()
    .or(z.literal('')),
  contact: z.string()
    .max(50, 'Keterangan maksimal 50 karakter')
    .optional()
    .or(z.literal('')),
  email: z.string()
    .email()
    .max(50, 'Keterangan maksimal 50 karakter')
    .optional()
    .or(z.literal('')),
  description: z.string()
    .max(300, 'Keterangan maksimal 300 karakter')
    .optional()
    .or(z.literal('')),
});
