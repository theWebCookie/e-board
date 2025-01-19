import { IBoardWithUsers } from '@/app/home/page';
import { BoardItem } from './BoardItem';
import { useEffect, useState } from 'react';
import { Skeleton } from '../ui/skeleton';
import { getCookie } from '@/lib/cookies';
import { decodeJwt } from 'jose';
import { toast } from '../ui/use-toast';
import { boardToastDictionary, genericDictionary, toastTimeout } from '@config';

export const BoardList = () => {
  const [boards, setBoards] = useState<IBoardWithUsers[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);

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

  useEffect(() => {
    const fetchUserId = async () => {
      const tokenCookie = await getCookie('token');
      const token = tokenCookie?.value;
      const decoded = token && (decodeJwt(token) as { id: number });
      const userId = decoded ? decoded.id : null;
      setUserId(userId);
    };

    fetchUserId();
  });

  const handleBoardDelete = async (id: number) => {
    const res = await fetch('/api/deleteBoard', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      toast({
        title: genericDictionary['generic-error'],
        description: `${errorData.error}`,
        duration: toastTimeout,
      });
      return;
    }

    setBoards((prevBoards) => prevBoards.filter((board) => board.id !== id));

    toast({
      title: boardToastDictionary['success-delete-toast-title'],
      duration: toastTimeout,
    });
  };

  return (
    <ul className='max-h-96 overflow-y-auto'>
      {isLoading ? (
        Array.from({ length: 3 }).map((_, index) => (
          <li key={index}>
            <Skeleton className='max-w-3xl h-[60px] mx-auto my-3 bg-muted rounded-xl' />
          </li>
        ))
      ) : boards.length === 0 ? (
        <p className='mt-7 text-gray-300 text-center'>Nie masz jeszcze tablic</p>
      ) : (
        boards.map((board) => <BoardItem key={board.id} board={board} userId={userId} handleBoardDelete={handleBoardDelete} />)
      )}
    </ul>
  );
};
