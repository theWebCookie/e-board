'use client';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Form, FormField, FormItem, FormControl, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Toaster } from '../ui/toaster';
import { useToast } from '../ui/use-toast';
import { createBoardSchema } from './schema';
import { boardToastDictionary, toastTimeout } from '@config';
import { useRouter } from 'next/navigation';
import { getCookie } from '@/lib/cookies';
import { PlusIcon } from 'lucide-react';

const CreateBoard = () => {
  const form = useForm<z.infer<typeof createBoardSchema>>({
    resolver: zodResolver(createBoardSchema),
    defaultValues: {
      boardName: '',
    },
  });

  const router = useRouter();

  const handleBoardCreate = async () => {
    const { boardName } = form.getValues();
    if (!boardName) {
      return;
    }

    const token = await getCookie('token');

    if (token === undefined) {
      return;
    }

    const res = await fetch('/api/createBoard', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: boardName }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      toast({
        title: boardToastDictionary['fail-board-toast-title'],
        description: `${errorData.error}`,
        duration: toastTimeout,
      });
      return;
    }

    const data = await res.json();
    toast({
      title: boardToastDictionary['success-board-toast-title'],
      description: `Tablica ${data.name} została utworzona! Kod zaproszenia to: ${data.boardInviteCode}`,
      duration: toastTimeout + 4000,
    });

    setTimeout(() => {
      router.push(`/board/${data.boardId}-${boardName}`);
    }, 2000);
  };

  const onSubmit = () => {};

  const { toast } = useToast();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon /> Nowa tablica
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Stwórz tablicę</DialogTitle>
          <DialogDescription>Ktokolwiek kto ma link może dołączyc do twojej tablicy.</DialogDescription>
        </DialogHeader>
        <div>
          <Label htmlFor='name' className='sr-only'>
            Nazwa
          </Label>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='flex items-center gap-2'>
              <div className='flex gap-2'>
                <FormField
                  control={form.control}
                  name='boardName'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder='Nazwa' type='text' {...field} className='' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter className='sm:justify-start'>
                  <Button type='submit' onClick={handleBoardCreate}>
                    Stwórz
                  </Button>
                </DialogFooter>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
      <Toaster />
    </Dialog>
  );
};

export default CreateBoard;
