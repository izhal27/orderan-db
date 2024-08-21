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
    .max(100, 'Alamat maksimal 100 karakter')
    .optional()
    .or(z.literal('')),
  contact: z.string()
    .max(50, 'Kontak maksimal 50 karakter')
    .optional()
    .or(z.literal('')),
  email: z.string()
    .email()
    .max(50, 'Email maksimal 50 karakter')
    .optional()
    .or(z.literal('')),
  description: z.string()
    .max(300, 'Keterangan maksimal 300 karakter')
    .optional()
    .or(z.literal('')),
});

export const userSchema = z.object({
  username: z.string()
    .min(5, 'Username minimal 3 karakter, hanya mengandung karakter huruf & angka'),
  password: z.string()
    .min(3, 'Password minimal 3 karakter'),
  email: z.string()
    .email()
    .optional()
    .or(z.literal('')),
  name: z.string()
    .max(50, 'Nama maksimal 50 karakter')
    .optional()
    .or(z.literal('')),
  blocked: z.boolean()
    .optional()
    .or(z.literal('')),
  roleId: z.number().min(1, 'User harus punya Role'),
});
