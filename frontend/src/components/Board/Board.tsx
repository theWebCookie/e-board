'use client';
import { useRouter } from 'next/navigation';
import { useState, useCallback, useEffect } from 'react';
import BoardButton from '../BoardButton/BoardButton';
import Canvas from '../Canvas/Canvas';
import Chat from '../Chat/Chat';
import ToolMenu from '../ToolMenu/ToolMenu';
import ToolPicker from '../ToolPicker/ToolPicker';
import { useBoard } from './BoardProvider';
import { IBoardProps } from '@/app/board/[id]/page';
import Arrow from '../Arrow/Arrow';
import { getCookie } from '@/lib/cookies';

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

export const Board: React.FC<IBoardProps> = ({ id, boardName }) => {
  const { isHidden, isToolMenuOpen } = useBoard();
  const router = useRouter();
  const [dbElements, setDbElements] = useState('');
  const [dbMessages, setDbMessages] = useState([]);
  const handleGoBack = useCallback(() => router.back(), [router]);

  const [userName, setUserName] = useState<string | undefined>(undefined);

  useEffect(() => {
    getCookie('name').then((cookie) => {
      setUserName(cookie?.value);
    });
  }, []);

  useEffect(() => {
    const loadCanvas = async () => {
      const res = await fetch(`/api/load?id=${id}`);

      if (res.ok) {
        const data = await res.json();
        setDbElements(data.content.elements);
      }

      return;
    };

    const loadMessages = async () => {
      const res = await fetch(`/api/messages?id=${id}`);

      if (res.ok) {
        const data = await res.json();
        setDbMessages(data.messages);
      }

      return;
    };

    loadCanvas();
    loadMessages();
  }, [id]);

  return (
    <div className='w-full h-screen'>
      <Canvas roomId={id} dbElements={dbElements} />
      <div className='flex items-center justify-center absolute top-7 left-7 w-full'>
        <Arrow className='absolute left-2.5' fn={handleGoBack} />
        <ToolPicker className='flex justify-center flex-grow mx-auto' />
      </div>
      <Chat
        roomId={id}
        boardName={boardName}
        className={`absolute top-0 right-0 transition-transform`}
        name={userName || 'User'}
        dbMessages={dbMessages}
      />
      <ToolMenu className={`absolute top-1/3 left-7 border-2 rounded ${isToolMenuOpen ? '' : 'hidden'}`} />
      <BoardButton className='absolute bottom-7 left-7' alt='board-button' path='/board-button.svg' />
    </div>
  );
};
