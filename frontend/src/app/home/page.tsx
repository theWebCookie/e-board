import InteractiveSections from '@/components/InteractiveSections/InteractiveSections';
import InviteCodeForm from '@/components/InviteCodeForm/InviteCodeForm';
import LayoutWithNav from '@/components/LayoutWithNav/LayoutWithNav';
import { Separator } from '@/components/ui/separator';
import React from 'react';

export interface IUser {
  name: string;
  email: string;
}
export interface IBoard {
  name: string;
  id: number;
}

export interface IBoardWithUsers extends IBoard {
  users: IUser[];
  board: IBoard;
  inviteCode: string;
  createdAt: Date;
  updatedAt: Date;
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
