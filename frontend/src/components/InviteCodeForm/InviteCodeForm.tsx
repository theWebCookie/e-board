'use client';
import { useForm } from 'react-hook-form';
import { Input } from '../ui/input';
import inviteFormSchema from './schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import { Button } from '../ui/button';
import { useEffect, useState } from 'react';
import { Toaster } from '../ui/toaster';
import { useToast } from '../ui/use-toast';
import { boardToastDictionary, toastTimeout } from '@config';
import { useRouter } from 'next/navigation';
import { getCookie } from '@/lib/cookies';

const InviteFormCode = () => {
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const form = useForm<z.infer<typeof inviteFormSchema>>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      code: '',
    },
  });
  const { toast } = useToast();
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof inviteFormSchema>) => {
    const userId = await getCookie('userId');
    if (userId === undefined) return;
    const res = await fetch('/api/invite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code: values.code, userId: userId.value }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      toast({
        title: boardToastDictionary['fail-invite-toast-title'],
        description: `${errorData.error}`,
        duration: toastTimeout,
      });
      return;
    }

    const data = await res.json();
    console.log(data);
    toast({
      title: boardToastDictionary['success-invite-toast-title'],
      description: 'Dołączono do tablicy',
      duration: toastTimeout,
    });

    router.push(`/board/${data.boardId}`);
  };

  const code = form.watch('code');

  useEffect(() => {
    const isCodeValid = code.trim().length === 8;
    setIsDisabled(!isCodeValid);
  }, [code]);

  return (
    <section className='my-3 flex'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex gap-2'>
          <FormField
            name='code'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} placeholder='Kod tablicy' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit' className='' disabled={isDisabled}>
            Dołącz
          </Button>
        </form>
      </Form>
      <Toaster />
    </section>
  );
};

export default InviteFormCode;
