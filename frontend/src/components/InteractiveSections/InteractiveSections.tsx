'use client';
import { IBoardWithUsers } from '@/app/home/page';
import CreateBoard from '../CreateBoard/CreateBoard';
import DashboardCard from '../DashboardCard/DashboardCard';
import { useEffect, useState } from 'react';

const InteractiveSections = () => {
  const [boards, setBoards] = useState<IBoardWithUsers[]>([]);
  useEffect(() => {
    const fetchBoards = async () => {
      const res = await fetch('/api/boards');
      if (!res.ok) {
        setBoards([]);
        return;
      }
      const data = await res.json();
      setBoards(data);
    };
    fetchBoards();
  }, []);

  console.log(boards);
  return (
    <>
      <section className='flex gap-5 items-center flex-wrap my-3'>
        {boards
          ? boards.map((board: IBoardWithUsers) => <DashboardCard key={board.id} name={board.name} id={board.id} users={board.users} />)
          : 'Brak tablic'}
      </section>
      <section className='w-full'>
        <CreateBoard />
      </section>
    </>
  );
};

export default InteractiveSections;
