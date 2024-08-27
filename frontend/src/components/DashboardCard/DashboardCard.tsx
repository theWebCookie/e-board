import { IBoardWithUsers } from '@/app/home/page';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import Link from 'next/link';
import { User } from 'lucide-react';
import { Tooltip, TooltipProvider } from '../ui/tooltip';
import { TooltipContent, TooltipTrigger } from '@radix-ui/react-tooltip';
import DashboardCardDescription from './DashboardCardDescription';
import Image from 'next/image';
import CardDrawer from './CardDrawer';

interface IDashboardCardProps {
  board: IBoardWithUsers;
}

const DashboardCard: React.FC<IDashboardCardProps> = ({ board }) => {
  const { id, name, users } = board;
  return (
    <Card className='max-w-xs w-80 relative'>
      <div className='absolute top-6 right-6'>
        <CardDrawer boardInfo={board}>
          <Image src='/info.svg' alt='info' width={20} height={20} />
        </CardDrawer>
      </div>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <DashboardCardDescription numOfUsers={users.length} />
      </CardHeader>
      <CardContent
        className='flex justify-between
      items-center'
      >
        <div className='flex gap-1'>
          {users.map((user, idx) => (
            <span key={idx} className='flex shrink-0 w-8 h-8 rounded-full overflow-hidden'>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <User width={32} height={32} className='aspect-squre h-full w-full' />
                  </TooltipTrigger>
                  <TooltipContent>{user.name}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </span>
          ))}
        </div>
        <div>
          <Button className='py-1 flex items-center'>
            <Link href={`/board/${id}`}>Wejdź</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
