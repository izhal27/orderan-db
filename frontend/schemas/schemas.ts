import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  password: z.string().min(3, "Password minimal 3 karakter"),
});

export const orderTypeSchema = z.object({
  name: z.string().min(5, "Nama minimal 5 karakter"),
  description: z
    .string()
    .max(300, "Keterangan maksimal 300 karakter")
    .optional()
    .or(z.literal("")),
});

export const customerSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  address: z
    .string()
    .max(100, "Alamat maksimal 100 karakter")
    .optional()
    .or(z.literal("")),
  contact: z
    .string()
    .max(50, "Kontak maksimal 50 karakter")
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .email()
    .max(50, "Email maksimal 50 karakter")
    .optional()
    .or(z.literal("")),
  description: z
    .string()
    .max(300, "Keterangan maksimal 300 karakter")
    .optional()
    .or(z.literal("")),
});

export const userSchema = z.object({
  username: z
    .string()
    .min(
      5,
      "Username minimal 5 karakter, hanya mengandung karakter huruf & angka",
    ),
  password: z
    .string()
    .min(3, "Password minimal 3 karakter")
    .optional()
    .or(z.literal("")),
  email: z.string().email("Email yang anda masukkan salah"),
  name: z
    .string()
    .min(3, "Nama minimal 3 karakter")
    .max(50, "Nama maksimal 50 karakter"),
  roleId: z.number().optional().or(z.literal("")),
  // blocked: z.boolean()
  //   .optional()
  //   .or(z.literal('')),
});

export const orderDetailSchema = z.object({
  // name: z
  //   .string()
  //   .min(5, "Nama Jenis pesanan minimal 3 karakter"),
  width: z
    .number()
    .min(0, "Width minimal 0")
    .max(100000, "Width maksimal 100000"),
  height: z
    .number()
    .min(0, "Heigth minimal 0")
    .max(100000, "Width maksimal 100000"),
  qty: z
    .number()
    .min(1, "Qty minimal 1")
    .max(10000, "Qty maksimal 10000"),
  design: z
    .number()
    .min(0, "Design minimal 0")
    .max(1000, "Design maksimal 1000")
    .optional()
    .or(z.literal(0)),
  eyelets: z
    .boolean(),
  shiming: z
    .boolean(),
  description: z
    .string()
    .max(300, "Keterangan maksimal 300 karakter")
    .optional()
    .or(z.literal("")),
});
