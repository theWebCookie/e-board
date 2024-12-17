'use client';
import { IElement } from '@/app/board/utils';
import { useWebSocket } from '@/app/home/page';
import { useRouter } from 'next/navigation';
import { useState, useCallback, useEffect } from 'react';
import BoardButton from '../BoardButton/BoardButton';
import Canvas from '../Canvas/Canvas';
import Chat, { IMessage } from '../Chat/Chat';
import ToolMenu from '../ToolMenu/ToolMenu';
import ToolPicker from '../ToolPicker/ToolPicker';
import { useBoard } from './BoardProvider';
import { IBoardProps } from '@/app/board/[id]/page';
import Arrow from '../Arrow/Arrow';

export interface ITool {
  name: string;
  icon: string;
  type: string;
}

export interface IOptions {
  roughness: string;
  seed: number | null;
  fill: string;
  stroke: string;
  strokeWidth: string;
  strokeLineDash: string;
  opacity: string;
  fontSize: string;
}

export interface IImageData {
  width: number;
  height: number;
  data: string;
}

export const Board: React.FC<IBoardProps> = ({ id }) => {
  const { isHidden, isToolMenuOpen } = useBoard();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const router = useRouter();
  const handleGoBack = useCallback(() => router.back(), [router]);
  const { ws, sendMessage, receivedElements, messages, clientId } = useWebSocket();

  const handleChatOpen = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className='w-full h-screen'>
      <Canvas ws={ws} sendMessage={sendMessage} receivedElements={receivedElements} roomId={id} clientId={clientId} />
      <div className='flex items-center justify-center absolute top-7 left-7 w-full'>
        <Arrow className='absolute left-2.5' fn={handleGoBack} />
        <ToolPicker className='flex justify-center flex-grow mx-auto' />
      </div>
      <Arrow
        className={`absolute right-0 bottom-1/2 translate-x-[-28px] translate-y-1/2 transition-transform ${
          isChatOpen ? 'translate-x-[-296px] rotate-180 z-10 bg-white size-12 rounded-full flex items-center justify-center' : ''
        }`}
        fn={handleChatOpen}
      />
      <Chat
        ws={ws}
        sendMessage={sendMessage}
        roomId={id}
        messages={messages}
        clientId={clientId}
        boardName='Mock Board'
        className={`absolute top-0 right-0 transition-transform ${isChatOpen ? 'translate-x-0' : 'translate-x-[20rem]'} ${isHidden ? 'hidden' : ''}`}
      />
      <ToolMenu className={`absolute top-1/3 left-7 border-2 rounded ${isToolMenuOpen ? '' : 'hidden'}`} />
      <BoardButton className='absolute bottom-7 left-7' alt='board-button' path='/board-button.svg' />
    </div>
  );
};
