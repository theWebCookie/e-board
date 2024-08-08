import { z } from 'zod';
import { inviteFormDictionary } from '@config';

const inviteFormSchema = z.object({
  code: z.string().min(1, inviteFormDictionary['invite-code-is-required']),
});

export default inviteFormSchema;
