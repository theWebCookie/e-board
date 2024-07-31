import { z } from 'zod';

const registerFormSchema = z.object({
  name: z.string().min(1, 'Imię jest wymagane.'),
  email: z.string().min(1, 'Email jest wymagany.').email('Niepoprawny adres email.'),
  password: z.string().min(1, 'Hasło jest wymagane.').min(6, 'Hasło musi mieć co najmniej 6 znaków.'),
});

export default registerFormSchema;
