import { z } from 'zod';
import { loginSchema } from '../schemas/loginSchema';

export type FormData = z.infer<typeof loginSchema>;
