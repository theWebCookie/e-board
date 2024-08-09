import InteractiveSections from '@/components/InteractiveSections/InteractiveSections';
import InviteCodeForm from '@/components/InviteCodeForm/InviteCodeForm';
import LayoutWithNav from '@/components/LayoutWithNav/LayoutWithNav';
import { Separator } from '@/components/ui/separator';
import React from 'react';

export interface IUser {
  name: string;
  image: string;
}
export interface ICard {
  title: string;
  id: number;
  description: string;
}

export interface ICardWithUsers extends ICard {
  users: IUser[];
}

const Home = () => {
  return (
    <LayoutWithNav>
      <InviteCodeForm />
      <Separator />
      <InteractiveSections />
    </LayoutWithNav>
  );
};

export default Home;
