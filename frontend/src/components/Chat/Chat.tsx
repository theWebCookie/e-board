'use client';
import { useEffect, useRef, useState } from 'react';
import { Separator } from '../ui/separator';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import Image from 'next/image';
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Messages from './Messages';

interface IChatProps {
  boardName: string;
}

export interface IMessage {
  message: string;
  clientId: string;
}

const chatFormSchema = z.object({
  message: z.string().max(40, 'Wiadomość nie może być dłuższa niż 40 znaków.'),
});

const Chat: React.FC<IChatProps> = ({ boardName }) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [clientId, setClientId] = useState<string | null>(null);
  const ws = useRef<WebSocket | null>(null);

  const form = useForm<z.infer<typeof chatFormSchema>>({
    resolver: zodResolver(chatFormSchema),
    defaultValues: {
      message: '',
    },
  });

  useEffect(() => {
    ws.current = new WebSocket(`ws://localhost:8080`);
    ws.current.binaryType = 'blob';

    ws.current.addEventListener('open', () => {
      console.log('Websocket connection opened');
    });

    ws.current.addEventListener('close', () => {
      console.log('Websocket connection closed');
    });

    ws.current.addEventListener('message', (message: MessageEvent) => {
      const data = JSON.parse(message.data);
      if (data.type === 'client-id') {
        setClientId(data.clientId);
      } else {
        setMessages((prevMessages) => [...prevMessages, { message: data.message, clientId: data.clientId }]);
      }
    });

    return () => {
      ws.current?.close();
    };
  }, []);

  const onSubmit = async (values: z.infer<typeof chatFormSchema>) => {
    if (ws.current && clientId) {
      const messageData = { message: values.message, clientId };
      ws.current.send(JSON.stringify(messageData));
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
            <Button type='submit' className=''>
              <Image src='/send.svg' alt='send' width={20} height={20} />
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Chat;
