import { z } from 'zod';

export const createBoardSchema = z.object({
  boardName: z.string().min(1, {
    message: 'Nazwa jest wymagana',
  }),
});
