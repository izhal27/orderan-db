import { z } from 'zod';
import { loginSchema, orderTypeSchema } from '../schemas/schemas';

export type LoginFormData = z.infer<typeof loginSchema>;
export type OrderTypeFormData = z.infer<typeof orderTypeSchema>;
