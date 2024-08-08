'use client';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Form, FormField, FormItem, FormControl, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Copy } from 'lucide-react';
import { Toaster } from '../ui/toaster';
import { useToast } from '../ui/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { createBoardSchema } from './schema';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { boardToastDictionary, toastTimeout } from '@config';
import { useRouter } from 'next/navigation';

const CreateBoard = () => {
  const [inviteCode, setInviteCode] = useState<string>('');
  const form = useForm<z.infer<typeof createBoardSchema>>({
    resolver: zodResolver(createBoardSchema),
    defaultValues: {
      boardName: '',
    },
  });

  const router = useRouter();

  useEffect(() => {
    const fetchInviteCode = async () => {
      const res = await fetch('/api/createBoard');
      if (!res.ok) {
        const errorData = await res.json();
        return Response.json({ error: errorData.error });
      }
      const data = await res.json();
      setInviteCode(data.code);
    };
    fetchInviteCode();
  }, []);

  const handleBoardCreate = async () => {
    const { boardName } = form.getValues();
    if (!boardName) {
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
      description: `Tablica ${data.name} została utworzona!`,
      duration: toastTimeout,
    });

    setTimeout(() => {
      router.push(`/board/${data.boardId}`);
    }, 2000);
  };

  const onSubmit = () => {};

  const { toast } = useToast();

  const handleCopy = () => {
    const link = document.getElementById('link') as HTMLInputElement;
    navigator.clipboard.writeText(link.value);
    toast({
      description: 'Skopiowano!',
      duration: 2000,
    });
  };

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
            <div className='flex items-center gap-2'>
              <div className='mt-1'>
                <Label htmlFor='link' className='sr-only'>
                  Link
                </Label>
                <Input id='link' defaultValue={inviteCode} readOnly className='text-slate-400' />
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div
                      className='flex justify-center items-center bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3'
                      onClick={handleCopy}
                    >
                      <span className='sr-only'>Kopiuj</span>
                      <Copy className='h-4 w-4' />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Kopiuj</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </DialogContent>
        <Toaster />
      </Dialog>
    </div>
  );
};

export default CreateBoard;
