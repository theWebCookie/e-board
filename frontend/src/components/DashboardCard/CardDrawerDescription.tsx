import { IUser } from '@/app/home/page';
import { DrawerDescription } from '../ui/drawer';
import { Separator } from '../ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { toastTimeout } from '@config';
import { toast } from '../ui/use-toast';
import { MouseEvent } from 'react';

interface ICardDrawerDescriptionProps {
  users: IUser[];
  inviteCode: string;
  createdAt: Date;
  updatedAt: Date;
}

// TODO:
// - Display chart of elapsed time on board from API

const CardDrawerDescription: React.FC<ICardDrawerDescriptionProps> = ({ users, inviteCode, createdAt, updatedAt }) => {
  const handleCopy = (event: MouseEvent<HTMLSpanElement>) => {
    const spanElement = event.currentTarget as HTMLSpanElement;
    const textToCopy = spanElement.textContent || '';
    navigator.clipboard.writeText(textToCopy);
    toast({
      title: 'Kod skopiowany',
      description: 'Kod dostępu został skopiowany do schowka',
      duration: toastTimeout,
    });
  };

  const formatDate = (date: Date): string => {
    const dateToFormat = new Date(date);
    const timePart = dateToFormat.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const datePart = dateToFormat.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });

    return `${timePart} ${datePart}`;
  };

  return (
    <>
      <TooltipProvider>
        <DrawerDescription className='flex gap-3'>
          <span>Utworzono {formatDate(createdAt)}</span>
          <span>Ostatnia modyfikacja {formatDate(updatedAt)}</span>
        </DrawerDescription>
        <Separator />
        <div>
          <p>
            Kod zaproszenia:{' '}
            <span onClick={(e) => handleCopy(e)} className='cursor-pointer'>
              {inviteCode}
            </span>
          </p>
        </div>
        <Separator />
        <div>
          <h2>Uczestnicy:</h2>
          <ul className='list-disc list-inside'>
            {users.map((user, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <li key={index}>{user.name}</li>
                </TooltipTrigger>
                <TooltipContent>{user.email}</TooltipContent>
              </Tooltip>
            ))}
          </ul>
        </div>
      </TooltipProvider>
    </>
  );
};

export default CardDrawerDescription;
