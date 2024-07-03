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

const CreateBoard = () => {
  const form = useForm<z.infer<typeof createBoardSchema>>({
    resolver: zodResolver(createBoardSchema),
    defaultValues: {
      boardName: '',
    },
  });

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
          <Button variant='outline' className='bg-slate-300 size-20 flex items-center justify-center rounded-full hover:bg-slate-500'>
            <Image src='/circle-plus.svg' alt='add button' width={60} height={60} />
          </Button>
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
                      <Button type='submit' variant='secondary'>
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
                <Input id='link' defaultValue='/board/123as#$?1' readOnly className='text-slate-400' />
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Button size='sm' className='px-3' onClick={handleCopy}>
                      <span className='sr-only'>Kopiuj</span>
                      <Copy className='h-4 w-4' />
                    </Button>
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
