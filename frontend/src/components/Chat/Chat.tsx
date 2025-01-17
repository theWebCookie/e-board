'use client';
import { Button } from '../ui/button';
import Image from 'next/image';
import { Form, FormField, FormControl, FormItem, FormMessage } from '../ui/form';
import { Separator } from '../ui/separator';
import Messages from './Messages';
import chatFormSchema from './schema';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Textarea } from '../ui/textarea';
import { ScrollArea } from '../ui/scroll-area';
import { useWebSocket } from '@/app/home/page';
import { getCookie } from '@/lib/cookies';

interface IChatProps {
  boardName: string;
  className: string;
  roomId: string;
  name: string;
  dbMessages?: any;
}

export interface IMessage {
  message: string;
  clientId: string;
  name: string;
  sentAt: string;
}

const Chat: React.FC<IChatProps> = ({ boardName, className, roomId, name, dbMessages }) => {
  const { ws, sendMessage, messages, clientId } = useWebSocket();
  const form = useForm<z.infer<typeof chatFormSchema>>({
    resolver: zodResolver(chatFormSchema),
    defaultValues: {
      message: '',
    },
  });

  const messageValue = form.watch('message');

  const onSubmit = async (values: z.infer<typeof chatFormSchema>) => {
    if (ws && clientId) {
      const messageData = { type: 'message', clientId, roomId, message: { message: values.message, name, sentAt: Date.now() } };
      sendMessage(messageData);
      sendMessage({
        type: 'notification',
        title: `Nowa wiadomość na tablicy ${boardName}`,
        recieverId: [],
        userId: clientId,
        roomId,
      });
      form.setValue('message', '', { shouldValidate: false });
    }
  };

  return (
    <div className={`w-1/5 p-3 pb-7 h-screen border border-l-neutral-600 ${className}`}>
      <h1 className='mb-1 capitalize'>{boardName}</h1>
      <Separator />
      <ScrollArea className='h-full rounded-md p-1 pb-20'>
        <Messages messages={[...dbMessages, ...messages] as IMessage[]} currentClientId={clientId} />
      </ScrollArea>
      <div className='py-3 absolute bottom-0 left-0 w-full'>
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
