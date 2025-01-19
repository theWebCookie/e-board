'use client';
import { Info, Pencil, Trash } from 'lucide-react';
import { FC } from 'react';
import { IBoardWithUsers, useWebSocket } from '@/app/home/page';
import CardDrawer from '../DashboardCard/CardDrawer';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import DeleteBoardDialog from './DeleteBoardDialog';

interface BoardItemProps {
  board: IBoardWithUsers;
  userId: number | null;
  handleBoardDelete: (id: number) => void;
}

export const BoardItem: FC<BoardItemProps> = ({ board, userId, handleBoardDelete }) => {
  const { id, name, users, authorId } = board;
  const { sendMessage } = useWebSocket();
  const router = useRouter();

  const handleJoinRoom = () => {
    sendMessage({ type: 'join-room', roomId: id });
    router.push(`/board/${id}-${name}`);
  };

  return (
    <li className='flex justify-between items-center my-3 p-3 bg-[#e4e5f1] rounded-xl cursor-pointer hover:bg-[#9394a5]' onClick={handleJoinRoom}>
      <div className='flex items-center gap-3'>
        <div className='ml-3'>
          <Pencil />
        </div>
        <div>
          <p className='text-sm font-medium'>{name}</p>
          <p className='text-[#4d4d4d] text-xs'>Liczba uczestników: {users.length}</p>
        </div>
      </div>
      <div className='flex' onClick={(e) => e.stopPropagation()}>
        <CardDrawer boardInfo={board}>
          <Info />
        </CardDrawer>
        {userId === authorId && <DeleteBoardDialog boardId={id} handleBoardDelete={handleBoardDelete} />}
      </div>
    </li>
  );
};
