import { ICardWithUsers } from '@/app/home/page';
import CreateBoard from '../CreateBoard/CreateBoard';
import DashboardCard from '../DashboardCard/DashboardCard';

// mock boards that user was a part of
const cards: ICardWithUsers[] = [
  {
    title: 'Pusta tablica',
    id: 1,
    description: 'empty boardempty boardempty boardempty boardempty board',
    users: [
      { name: 'John Doe', image: '/avatar.png' },
      { name: 'Jane Doe', image: '/avatar.png' },
    ],
  },
  {
    title: 'Pusta tablica2',
    id: 2,
    description: 'empty board 2',
    users: [
      { name: 'John Doe', image: '/avatar.png' },
      { name: 'Jane Doe', image: '/avatar.png' },
    ],
  },
];

const InteractiveSections = () => {
  return (
    <>
      <section className='flex gap-5 items-center flex-wrap my-3'>
        {cards.map((card) => (
          <DashboardCard key={card.title} title={card.title} id={card.id} description={card.description} users={card.users} />
        ))}
      </section>
      <section className='w-full'>
        <CreateBoard />
      </section>
    </>
  );
};

export default InteractiveSections;
