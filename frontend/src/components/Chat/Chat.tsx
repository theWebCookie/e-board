'use client';
import { useState } from 'react';
import { Button } from '../ui/button';
import Image from 'next/image';
import { Form, FormField, FormControl, FormItem, FormMessage } from '../ui/form';
import { Separator } from '../ui/separator';
import Messages from './Messages';
import { useWebSocket } from './useWebSocket';
import chatFormSchema from './schema';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Textarea } from '../ui/textarea';
import { ScrollArea } from '../ui/scroll-area';

interface IChatProps {
  boardName: string;
  className: string;
}

export interface IMessage {
  message: string;
  clientId: string;
}

const Chat: React.FC<IChatProps> = ({ boardName, className }) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [clientId, setClientId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof chatFormSchema>>({
    resolver: zodResolver(chatFormSchema),
    defaultValues: {
      message: '',
    },
  });

  const messageValue = form.watch('message');

  const ws = useWebSocket('ws://localhost:8080', {
    onMessage: (data) => {
      if (data.type === 'client-id') {
        setClientId(data.clientId);
      } else {
        setMessages((prevMessages) => [...prevMessages, { message: data.message, clientId: data.clientId }]);
      }
    },
  });

  const onSubmit = async (values: z.infer<typeof chatFormSchema>) => {
    if (ws && clientId) {
      const messageData = { message: values.message, clientId };
      ws.send(JSON.stringify(messageData));
      form.setValue('message', '', { shouldValidate: false });
    }
  };

  return (
    <div className={`w-80 p-3 pb-7 bg-slate-100 h-screen ${className}`}>
      <h1 className='mb-1'>{boardName}</h1>
      <Separator />
      <ScrollArea className='h-full rounded-md p-1 pb-20'>
        <Messages messages={messages} currentClientId={clientId} />
      </ScrollArea>
      <div className='py-3 absolute bottom-0 left-0 bg-slate-200 w-full'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='flex items-center justify-around w-full'>
            <FormField
              name='message'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea placeholder='Wiadomość..' {...field} className='resize-none min-h-fit h-auto' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' disabled={!messageValue.trim()} className='mr-3'>
              <Image src='/send.svg' alt='send' width={20} height={20} />
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Chat;
