import { WebSocketProvider } from '@/app/home/page';
import { Board } from '@/components/Board/Board';
import { BoardProvider } from '@/components/Board/BoardProvider';
import React from 'react';

interface IBoardPageProps {
  params: IBoardProps;
}
export interface IBoardProps {
  id: string;
  boardName: string;
}

const BoardPage: React.FC<IBoardPageProps> = async ({ params }) => {
  const { id } = await params;
  const lastIndex = id.lastIndexOf('-');
  const boardIdPart = id.slice(0, lastIndex);
  const boardNamePart = id.slice(lastIndex + 1);
  const boardName = decodeURIComponent(boardNamePart);

  return (
    <WebSocketProvider>
      <BoardProvider>
        <Board id={boardIdPart} boardName={boardName} />
      </BoardProvider>
    </WebSocketProvider>
  );
};

export default BoardPage;
