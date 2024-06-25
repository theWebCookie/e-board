import { z } from 'zod';

const loginFormSchema = z.object({
  email: z.string().email('Niepoprawny adres email.'),
  password: z.string().min(6, 'Hasło musi mieć co najmniej 6 znaków.'),
});

export default loginFormSchema;
