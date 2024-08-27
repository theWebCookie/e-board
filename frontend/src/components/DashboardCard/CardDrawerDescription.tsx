import { IUser } from '@/app/home/page';
import { DrawerDescription } from '../ui/drawer';
import { Separator } from '../ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface ICardDrawerDescriptionProps {
  users: IUser[];
}

// TODO:
// - Display date from API
// - Display time spent on board from API

const CardDrawerDescription: React.FC<ICardDrawerDescriptionProps> = ({ users }) => {
  return (
    <>
      <TooltipProvider>
        <DrawerDescription>Utworzono 24/01/2024</DrawerDescription>
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
