'use client';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import loginFormSchema from './schema';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/button';
import { useForm } from 'react-hook-form';
import { useToast } from '../ui/use-toast';
import { useRouter } from 'next/navigation';
import { Separator } from '@radix-ui/react-separator';
import { DialogTrigger } from '../ui/dialog';
import { loginToastDictionary, toastTimeout } from '@config';

const LoginForm = () => {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof loginFormSchema>) => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ values, type: 'login' }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast({
          title: loginToastDictionary['fail-login-toast-title'],
          description: `${errorData.error}`,
          duration: toastTimeout,
        });
        return;
      }

      const data = await response.json();
      toast({
        title: loginToastDictionary['success-login-toast-title'],
        description: `Witaj ${data.name}!`,
        duration: toastTimeout,
      });

      router.push('/home');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 min-w-[250px]'>
          <FormField
            name='email'
            render={({ field }) => (
              <FormItem className='mb-5'>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder='Wprowadź email' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name='password'
            render={({ field }) => (
              <FormItem className='mb-5'>
                <FormLabel>Hasło</FormLabel>
                <FormControl>
                  <Input placeholder='Wprowadź hasło' type='password' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit' className='w-full'>
            Zaloguj
          </Button>
          <Separator />
        </form>
      </Form>
      <div className='flex flex-col justify-center'>
        <p className='text-center mt-3 mb-3 font-extralight from-neutral-500'>Nie masz konta?</p>
        <DialogTrigger asChild>
          <Button variant='outline'>Rejestracja</Button>
        </DialogTrigger>
      </div>
    </>
  );
};

export default LoginForm;
