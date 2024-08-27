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
}

// TODO:
// - Display date from API
// - Display chart of elapsed time on board from API
// - Display modified date from API

const CardDrawerDescription: React.FC<ICardDrawerDescriptionProps> = ({ users, inviteCode }) => {
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
  return (
    <>
      <TooltipProvider>
        <DrawerDescription className='flex gap-3'>
          <span>Utworzono 18:45 24/01/2024</span>
          <span>Ostatnia modyfikacja 14:01 25/01/2024</span>
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
