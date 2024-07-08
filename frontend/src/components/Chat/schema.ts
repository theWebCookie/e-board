import { z } from 'zod';

const chatFormSchema = z.object({
  message: z.string().max(40, 'Wiadomość nie może być dłuższa niż 40 znaków.'),
});

export default chatFormSchema;
