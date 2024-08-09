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
import Image from 'next/image';
import { boardToastDictionary, toastTimeout } from '@config';
import { useRouter } from 'next/navigation';
import { getCookie, getCookies } from '@/lib/cookies';

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

    const userId = await getCookie('userId');

    if (userId === undefined) {
      return;
    }

    const res = await fetch('/api/createBoard', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: boardName, userId: userId.value }),
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
      router.push(`/board/${data.boardId}`);
    }, 2000);
  };

  const onSubmit = () => {};

  const { toast } = useToast();

  return (
    <div className='max-w-2xl h-60 flex justify-center items-center bg-slate-200 rounded-lg hover:hover:bg-slate-300 pointer transition duration-300'>
      <Dialog>
        <DialogTrigger asChild>
          <div className='bg-slate-300 size-20 flex items-center justify-center rounded-full hover:bg-slate-500'>
            <Image src='/circle-plus.svg' alt='add button' width={60} height={60} />
          </div>
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
    </div>
  );
};

export default CreateBoard;
