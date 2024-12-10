'use client';
import InteractiveSections from '@/components/InteractiveSections/InteractiveSections';
import InviteCodeForm from '@/components/InviteCodeForm/InviteCodeForm';
import LayoutWithNav from '@/components/LayoutWithNav/LayoutWithNav';
import { Separator } from '@/components/ui/separator';
import React, { createContext, useContext, useEffect, useState } from 'react';

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
}

interface WebSocketContextType {
  ws: WebSocket | null;
  sendMessage: (message: any) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080');

    console.log(socket);

    socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    socket.onmessage = (message) => {
      console.log('Received message:', message.data);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    setWs(socket);
  }, []);

  const sendMessage = (message: any) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not open');
    }
  };

  return <WebSocketContext.Provider value={{ ws, sendMessage }}>{children}</WebSocketContext.Provider>;
};

export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

const Home = () => {
  return (
    <WebSocketProvider>
      <LayoutWithNav>
        <InviteCodeForm />
        <Separator />
        <InteractiveSections />
      </LayoutWithNav>
    </WebSocketProvider>
  );
};

export default Home;
