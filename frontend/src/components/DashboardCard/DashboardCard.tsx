import { ICardWithUsers } from '@/app/home/page';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import Link from 'next/link';
import Image from 'next/image';

const DashboardCard: React.FC<ICardWithUsers> = ({ title, url, description, users }) => {
  return (
    <Card className='max-w-xs'>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent
        className='flex justify-between
      items-center'
      >
        <div className='flex gap-1'>
          {users.map((user, idx) => (
            <span key={idx} className='flex shrink-0 w-8 h-8 rounded-full overflow-hidden'>
              <Image src='/avatar.png' alt={user.name} title={user.name} width={32} height={32} className='aspect-squre h-full w-full' />
            </span>
          ))}
        </div>
        <div>
          <Button>
            <Link href={url}>Wejdź</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
