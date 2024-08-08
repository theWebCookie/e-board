import { createBoardSchemaErrorDictionary } from '@config';
import { z } from 'zod';

export const createBoardSchema = z.object({
  boardName: z.string().min(1, {
    message: createBoardSchemaErrorDictionary['board-name-is-required'],
  }),
});
