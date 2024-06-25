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

  const mockData = {
    name: 'example',
    email: 'example@com.pl',
    password: '123456',
  };

  const onSubmit = async (values: z.infer<typeof registerFormSchema>) => {
    if (values.name !== mockData.name || values.email !== mockData.email || values.password !== mockData.password) {
      toast({
        title: 'Bład podczas rejestracji ☹️',
        description: `Niepoprawna dane do rejestracji`,
        duration: 3000,
      });
      return;
    } else {
      toast({
        title: 'Zarejestrowano pomyślnie 😊',
        description: `Witaj ${values.email}`,
        duration: 1000,
      });

      setTimeout(() => {
        router.push('/home');
      }, 1000);
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
