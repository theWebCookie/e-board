import DashboardCard from '@/components/DashboardCard/DashboardCard';
import LayoutWithNav from '@/components/LayoutWithNav/LayoutWithNav';
import React from 'react';

export interface IUser {
  name: string;
  image: string;
}
export interface ICard {
  title: string;
  url: string;
  description: string;
}

export interface ICardWithUsers extends ICard {
  users: IUser[];
}

// mock boards that user was a part of
const cards: ICardWithUsers[] = [
  {
    title: 'Pusta tablica',
    url: '/board/1',
    description: 'empty board',
    users: [
      { name: 'John Doe', image: '/avatar.png' },
      { name: 'Jane Doe', image: '/avatar.png' },
    ],
  },
  {
    title: 'Pusta tablica2',
    url: '/board/2',
    description: 'empty board 2',
    users: [
      { name: 'John Doe', image: '/avatar.png' },
      { name: 'Jane Doe', image: '/avatar.png' },
    ],
  },
];

const Home = () => {
  return (
    <LayoutWithNav>
      <h1>Home</h1>
      {cards.map((card) => (
        <DashboardCard key={card.title} title={card.title} url={card.url} description={card.description} users={card.users} />
      ))}
    </LayoutWithNav>
  );
};

export default Home;
