'use client';
import { Info, Pencil } from 'lucide-react';
import { FC } from 'react';
import { IBoardWithUsers, useWebSocket } from '@/app/home/page';
import CardDrawer from '../DashboardCard/CardDrawer';
import { useRouter } from 'next/navigation';

interface BoardItemProps {
  board: IBoardWithUsers;
}

export const BoardItem: FC<BoardItemProps> = ({ board }) => {
  const { id, name, users } = board;
  const { sendMessage } = useWebSocket();
  const router = useRouter();

  const handleJoinRoom = () => {
    sendMessage({ type: 'join-room', roomId: id });
    router.push(`/board/${id}`);
  };

  return (
    <li className='flex justify-between items-center my-3 p-3 bg-[#121215] rounded-xl cursor-pointer hover:bg-[#1a1a1d]' onClick={handleJoinRoom}>
      <div className='flex items-center gap-3'>
        <div className='ml-3'>
          <Pencil />
        </div>
        <div>
          <p className='text-sm font-medium'>{name}</p>
          <p className='text-[#a1a1aa] text-xs'>Liczba uczestników: {users.length}</p>
        </div>
      </div>
      <div className='flex' onClick={(e) => e.stopPropagation()}>
        <CardDrawer boardInfo={board}>
          <Info />
        </CardDrawer>
      </div>
    </li>
  );
};
