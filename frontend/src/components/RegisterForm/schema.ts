import { z } from 'zod';

const registerFormSchema = z.object({
  name: z.string().min(1, 'Imię jest wymagane.'),
  email: z.string().email('Niepoprawny adres email.'),
  password: z.string().min(6, 'Hasło musi mieć co najmniej 6 znaków.'),
});

export default registerFormSchema;
