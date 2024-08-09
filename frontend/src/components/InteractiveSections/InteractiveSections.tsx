'use client';
import { IBoardWithUsers } from '@/app/home/page';
import CreateBoard from '../CreateBoard/CreateBoard';
import DashboardCard from '../DashboardCard/DashboardCard';
import { useEffect, useState } from 'react';
import { Separator } from '../ui/separator';

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
      setBoards(data.reverse());
    };
    fetchBoards();
  }, []);

  return (
    <>
      <style>
        {`
        html, body {
          overflow: auto;
        }
      `}
      </style>
      <section className='my-3'>
        <CreateBoard />
      </section>
      <Separator />
      <section className='flex gap-5 items-center flex-wrap my-3'>
        {boards
          ? boards.map((board: IBoardWithUsers) => <DashboardCard key={board.id} name={board.name} id={board.id} users={board.users} />)
          : 'Brak tablic'}
      </section>
    </>
  );
};

export default InteractiveSections;
