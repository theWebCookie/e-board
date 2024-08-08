import { z } from 'zod';
import { schemaErrorDictionary, passwordLength } from '@config';

const registerFormSchema = z.object({
  name: z.string().min(1, schemaErrorDictionary['name-is-required']),
  email: z.string().min(1, schemaErrorDictionary['email-is-required']).email(schemaErrorDictionary['email-is-invalid']),
  password: z.string().min(1, schemaErrorDictionary['password-is-required']).min(passwordLength, schemaErrorDictionary['password-is-weak']),
});

export default registerFormSchema;
