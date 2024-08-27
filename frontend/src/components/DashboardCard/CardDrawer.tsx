import { IUser } from '@/app/home/page';
import { Button } from '../ui/button';
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '../ui/drawer';
import CardDrawerDescription from './CardDrawerDescription';
import Image from 'next/image';

interface ICardDrawerProps {
  children: React.ReactNode;
  name: string;
  users: IUser[];
}

const CardDrawer: React.FC<ICardDrawerProps> = ({ children, name, users }) => {
  const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
  return (
    <Drawer>
      <DrawerTrigger>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{capitalizedName}</DrawerTitle>
          <CardDrawerDescription users={users} />
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose>
            <Button variant='ghost' className='absolute top-6 right-6'>
              <Image src='/x.svg' alt='close' width={15} height={15} />
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default CardDrawer;
