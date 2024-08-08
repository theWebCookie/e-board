'use client';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import registerFormSchema from './schema';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/button';
import { useForm } from 'react-hook-form';
import { useToast } from '../ui/use-toast';
import { useRouter } from 'next/navigation';
import { registerToastDictionary, toastTimeout } from '@config';

const RegisterForm = () => {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof registerFormSchema>) => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ values, type: 'register' }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast({
          title: registerToastDictionary['fail-register-toast-title'],
          description: `${errorData.error}`,
          duration: toastTimeout,
        });
        return;
      }

      const data = await response.json();
      toast({
        title: registerToastDictionary['success-register-toast-title'],
        description: `Witaj ${data.name}!`,
        duration: toastTimeout,
      });

      setTimeout(() => {
        router.push('/home');
      }, 100);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 min-w-[250px]'>
        <FormField
          name='name'
          render={({ field }) => (
            <FormItem className='mb-5'>
              <FormLabel>Imię</FormLabel>
              <FormControl>
                <Input placeholder='Wprowadź imię' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <Button type='submit'>Zarejestruj</Button>
      </form>
    </Form>
  );
};

export default RegisterForm;
