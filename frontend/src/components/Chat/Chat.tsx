'use client';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import Image from 'next/image';
import { Form, FormField, FormControl, FormItem, FormMessage } from '../ui/form';
import { Separator } from '../ui/separator';
import Messages from './Messages';
import { useWebSocket } from './useWebSocket';
import chatFormSchema from './schema';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

interface IChatProps {
  boardName: string;
}

export interface IMessage {
  message: string;
  clientId: string;
}

const Chat: React.FC<IChatProps> = ({ boardName }) => {
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
    <div>
      <h1>{boardName}</h1>
      <Separator />
      <div>
        <Messages messages={messages} currentClientId={clientId} />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name='message'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder='Wiadomość..' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' disabled={!messageValue.trim()}>
              <Image src='/send.svg' alt='send' width={20} height={20} />
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Chat;
