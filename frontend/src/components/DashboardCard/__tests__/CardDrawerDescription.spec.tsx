import { render, screen, fireEvent } from '@testing-library/react';
import CardDrawerDescription from '../CardDrawerDescription';
import { IUser } from '@/app/home/page';
import { toast } from '@/components/ui/use-toast';
import { Dialog } from '@/components/ui/dialog';

jest.mock('../../ui/use-toast', () => ({
  toast: jest.fn(),
}));

Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: jest.fn(),
  },
});

describe('CardDrawerDescription Component', () => {
  const mockUsers: IUser[] = [
    { name: 'John Doe', email: 'john@example.com' },
    { name: 'Jane Smith', email: 'jane@example.com' },
  ];

  const mockProps = {
    users: mockUsers,
    inviteCode: '12345ABC',
    createdAt: new Date('2024-01-01T12:00:00Z'),
    updatedAt: new Date('2024-02-01T15:30:00Z'),
  };

  it('renders formatted dates correctly', () => {
    render(
      <Dialog>
        <CardDrawerDescription {...mockProps} />
      </Dialog>
    );
    expect(screen.getByText('Utworzono 13:00 01/01/2024')).toBeInTheDocument();
    expect(screen.getByText('Ostatnia modyfikacja 16:30 01/02/2024')).toBeInTheDocument();
  });

  it('copies invite code to clipboard when clicked', async () => {
    render(
      <Dialog>
        <CardDrawerDescription {...mockProps} />
      </Dialog>
    );

    const inviteCodeElement = screen.getByText('12345ABC');
    fireEvent.click(inviteCodeElement);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('12345ABC');
    expect(toast).toHaveBeenCalledWith({
      title: 'Kod skopiowany',
      description: 'Kod dostępu został skopiowany do schowka',
      duration: expect.any(Number),
    });
  });

  it('renders user list with tooltips', () => {
    render(
      <Dialog>
        <CardDrawerDescription {...mockProps} />
      </Dialog>
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });
});
