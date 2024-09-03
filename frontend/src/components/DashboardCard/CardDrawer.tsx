import { IUser } from '@/app/home/page';
import { Button } from '../ui/button';
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '../ui/drawer';
import CardDrawerDescription from './CardDrawerDescription';
import Image from 'next/image';
import { Toaster } from '../ui/toaster';

interface ICardDrawerProps {
  children: React.ReactNode;
  boardInfo: {
    name: string;
    users: IUser[];
    inviteCode: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

const CardDrawer: React.FC<ICardDrawerProps> = ({ children, boardInfo }) => {
  const { name, users, inviteCode, createdAt, updatedAt } = boardInfo;
  const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
  return (
    <Drawer>
      <DrawerTrigger>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{capitalizedName}</DrawerTitle>
          <CardDrawerDescription users={users} inviteCode={inviteCode} createdAt={createdAt} updatedAt={updatedAt} />
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose className='absolute top-6 right-6 w-4 h-4'>
            <Image src='/x.svg' alt='close' width={15} height={15} className='w-full h-auto' />
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
      <Toaster />
    </Drawer>
  );
};

export default CardDrawer;
