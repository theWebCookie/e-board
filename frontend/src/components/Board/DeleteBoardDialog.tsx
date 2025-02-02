'use client';
import { Button } from '../ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Toaster } from '../ui/toaster';
import { Trash } from 'lucide-react';

interface DeleteBoardDialogProps {
  boardId: number;
  handleBoardDelete: (id: number) => void;
}

const DeleteBoardDialog: React.FC<DeleteBoardDialogProps> = ({ boardId, handleBoardDelete }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='ghost' className='ml-2' aria-label='trash'>
          <Trash />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Usuń Tablicę</DialogTitle>
          <DialogDescription>Czy jesteś pewny, że chcesz usunąć tę tablicę? Ta operacja nie może być cofnięta.</DialogDescription>
        </DialogHeader>
        <div>
          <DialogFooter className='sm:justify-around p-2'>
            <div className='flex gap-4'>
              <Button type='submit' onClick={() => handleBoardDelete(boardId)}>
                Usuń
              </Button>
              <DialogClose asChild>
                <Button type='button' variant='secondary'>
                  Anuluj
                </Button>
              </DialogClose>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
      <Toaster />
    </Dialog>
  );
};

export default DeleteBoardDialog;
