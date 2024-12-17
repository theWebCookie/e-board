'use client';
import CreateBoard from '@/components/CreateBoard/CreateBoard';
import InviteCodeForm from '@/components/InviteCodeForm/InviteCodeForm';
import LayoutWithNav from '@/components/LayoutWithNav/LayoutWithNav';
import { MainLayout } from '@/components/MainLayout/MainLayout';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { BoardList } from '@/components/Board/BoardList';
import { toast } from '@/components/ui/use-toast';
import { toastTimeout } from '@config';
import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';
import { IElement } from '../board/utils';

export interface IUser {
  name: string;
  email: string;
}
export interface IBoard {
  name: string;
  id: number;
}

export interface IBoardWithUsers extends IBoard {
  users: IUser[];
  board: IBoard;
  inviteCode: string;
  createdAt: Date;
  updatedAt: Date;
}

interface WebSocketContextType {
  ws: WebSocket | null;
  sendMessage: (message: any) => void;
  receivedElements: IElement[];
  clientId: string | null;
  messages: IMessage[];
}

interface IMessage {
  message: string;
  clientId: string;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [receivedElements, setReceivedElements] = useState<IElement[]>([]);
  const [clientId, setClientId] = useState<string | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080');
    setWs(socket);

    socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    socket.onmessage = (message) => {
      const data = JSON.parse(message.data);
      console.log('Received WebSocket message:', data);

      if (data.type === 'canvas') {
        const newElements = JSON.parse(data.elements);
        setReceivedElements((prevElements) => {
          const newElementsMap = new Map<string, IElement>();

          prevElements.forEach((el) => {
            const key = `${el.id}-${el.type}`;
            newElementsMap.set(key, el);
          });

          newElements.forEach((el: IElement) => {
            const key = `${el.id}-${el.type}`;
            newElementsMap.set(key, el);
          });

          return Array.from(newElementsMap.values());
        });
      }

      if (data.type === 'client-id') {
        setClientId(data.clientId);
      }

      if (data.type === 'message') {
        console.log('Received message:', data.message);
        setMessages((prevMessages) => [...prevMessages, { message: data.message, clientId: data.clientId }]);
      }

      if (data.type === 'notification') {
        toast({
          title: data.notification.title,
          description: data.notification.author.name,
          duration: toastTimeout,
        });
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  const sendMessage = (message: any) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not open');
    }
  };

  return (
    <WebSocketContext.Provider
      value={{
        ws,
        sendMessage,
        receivedElements,
        clientId,
        messages,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

const Home = () => {
  const handleNotificationPost = async () => {
    const notificationData = {
      title: 'New notification',
      recieverIds: [1, 2, 3],
      userId: 1,
    };

    try {
      const response = await fetch('/api/notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationData),
      });

      if (!response.ok) {
        return;
      }

      const data = await response.json();
      console.log(data);
      // setNotifications([...notifications, data]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <WebSocketProvider>
      <LayoutWithNav>
        <MainLayout title='Tablice' isButtonVisible buttonComponent={<CreateBoard />}>
          <InviteCodeForm />
          <BoardList />
          <li>
            <Button onClick={handleNotificationPost}>Powiadomienie</Button>
          </li>
        </MainLayout>
        <Toaster />
      </LayoutWithNav>
    </WebSocketProvider>
  );
};

export default Home;
