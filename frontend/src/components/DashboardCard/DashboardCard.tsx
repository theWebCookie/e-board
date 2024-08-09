import { IBoardWithUsers } from '@/app/home/page';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import Link from 'next/link';
import { User } from 'lucide-react';
import { Tooltip, TooltipProvider } from '../ui/tooltip';
import { TooltipContent, TooltipTrigger } from '@radix-ui/react-tooltip';

const DashboardCard: React.FC<IBoardWithUsers> = ({ name, id, users }) => {
  return (
    <Card className='max-w-xs h-48'>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
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
