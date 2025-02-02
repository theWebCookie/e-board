import { render, screen, fireEvent } from '@testing-library/react';
import CardDrawer from '../CardDrawer';
import { IUser } from '@/app/home/page';

jest.mock('../../ui/toaster', () => ({
  Toaster: () => <div data-testid='toaster'></div>,
}));

jest.mock('../CardDrawerDescription', () => ({
  __esModule: true,
  default: ({ users, inviteCode, createdAt, updatedAt }: any) => (
    <div data-testid='card-drawer-description'>
      <p data-testid='invite-code'>{inviteCode}</p>
      <p data-testid='users-count'>{users.length}</p>
      <p data-testid='created-at'>{createdAt.toISOString()}</p>
      <p data-testid='updated-at'>{updatedAt.toISOString()}</p>
    </div>
  ),
}));

describe('CardDrawer Component', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  const mockBoardInfo = {
    name: 'test board',
    users: [{ name: 'User1', email: 'user@wp.pl' }] as IUser[],
    inviteCode: 'ABC12345',
    createdAt: new Date('2024-01-01T12:00:00Z'),
    updatedAt: new Date('2024-02-01T12:00:00Z'),
  };

  it('renders drawer trigger button', () => {
    render(
      <CardDrawer boardInfo={mockBoardInfo}>
        <span data-testid='open-drawer'>Open Drawer</span>
      </CardDrawer>
    );

    expect(screen.getByTestId('open-drawer')).toBeInTheDocument();
  });

  it('opens drawer and displays correct title & description', async () => {
    render(
      <CardDrawer boardInfo={mockBoardInfo}>
        <span data-testid='open-drawer'>Open Drawer</span>
      </CardDrawer>
    );

    const triggerButton = screen.getByTestId('open-drawer');
    fireEvent.click(triggerButton);

    expect(await screen.findByText('Test board')).toBeInTheDocument();

    expect(screen.getByTestId('invite-code')).toHaveTextContent(mockBoardInfo.inviteCode);
    expect(screen.getByTestId('users-count')).toHaveTextContent(mockBoardInfo.users.length.toString());
    expect(screen.getByTestId('created-at')).toHaveTextContent(mockBoardInfo.createdAt.toISOString());
    expect(screen.getByTestId('updated-at')).toHaveTextContent(mockBoardInfo.updatedAt.toISOString());
  });

  it('closes drawer when close button is clicked', () => {
    render(
      <CardDrawer boardInfo={mockBoardInfo}>
        <span data-testid='open-drawer'>Open Drawer</span>
      </CardDrawer>
    );

    const triggerButton = screen.getByTestId('open-drawer');
    fireEvent.click(triggerButton);

    const closeButton = screen.getByAltText('close');
    fireEvent.click(closeButton);
  });
});
