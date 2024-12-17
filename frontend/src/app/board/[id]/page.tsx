import { WebSocketProvider } from '@/app/home/page';
import { Board } from '@/components/Board/Board';
import { BoardProvider } from '@/components/Board/BoardProvider';
import React from 'react';

interface IBoardPageProps {
  params: IBoardProps;
}
export interface IBoardProps {
  id: string;
}

const BoardPage: React.FC<IBoardPageProps> = async ({ params }) => {
  const { id } = await params;
  return (
    <WebSocketProvider>
      <BoardProvider>
        <Board id={id} />
      </BoardProvider>
    </WebSocketProvider>
  );
};

export default BoardPage;
