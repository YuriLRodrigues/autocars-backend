import { z } from 'zod';

export const tokenPayloadSchema = z.object({
  sub: z.string().uuid(),
  roles: z.string().array(),
  avatar: z.string().optional(),
  name: z.string(),
  username: z.string(),
  email: z.string().email(),
});

export type UserPayload = z.infer<typeof tokenPayloadSchema>;
