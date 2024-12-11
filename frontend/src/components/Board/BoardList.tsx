import { IBoardWithUsers } from '@/app/home/page';
import { BoardItem } from './BoardItem';
import { useEffect, useState } from 'react';
import { Skeleton } from '../ui/skeleton';

export const BoardList = () => {
  const [boards, setBoards] = useState<IBoardWithUsers[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBoards = async () => {
      setIsLoading(true);
      const res = await fetch('/api/boards');
      if (!res.ok) {
        setBoards([]);
        return;
      }
      const data = await res.json();
      setBoards(data.reverse());
      setIsLoading(false);
    };
    fetchBoards();
  }, []);
  return (
    <ul>
      {isLoading ? (
        Array.from({ length: 3 }).map((_, index) => (
          <li key={index}>
            <Skeleton className='max-w-3xl h-[60px] mx-auto my-3 bg-muted rounded-xl' />
          </li>
        ))
      ) : boards.length === 0 ? (
        <p className='mt-7 text-gray-300 text-center'>Nie masz jeszcze tablic</p>
      ) : (
        boards.map((board) => <BoardItem key={board.id} board={board} />)
      )}
    </ul>
  );
};
