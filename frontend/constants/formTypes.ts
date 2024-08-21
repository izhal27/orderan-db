import { z } from 'zod';
import { customerSchema, loginSchema, orderTypeSchema } from '../schemas/schemas';

export type LoginFormData = z.infer<typeof loginSchema>;
export type OrderTypeFormData = z.infer<typeof orderTypeSchema>;
export type CustomerFormData = z.infer<typeof customerSchema>;
