import { render, screen, fireEvent } from '@testing-library/react';
import { BoardItem } from '../BoardItem'; // Adjust path if necessary
import { useRouter } from 'next/navigation';
import { useWebSocket } from '@/app/home/page';

// Mocking the required hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/app/home/page', () => ({
  useWebSocket: jest.fn(),
}));

jest.mock('../../DashboardCard/CardDrawer', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>, // Mocking CardDrawer as simple div for now
}));

jest.mock('../DeleteBoardDialog', () => ({
  __esModule: true,
  default: ({ boardId, handleBoardDelete }: { boardId: number; handleBoardDelete: (id: number) => void }) => (
    <button onClick={() => handleBoardDelete(boardId)}>Delete</button>
  ), // Mocking DeleteBoardDialog as a button
}));

describe('BoardItem Component', () => {
  const mockSendMessage = jest.fn();
  const mockHandleBoardDelete = jest.fn();
  const mockPush = jest.fn();

  const mockBoard = {
    id: 1,
    name: 'Test Board',
    users: [
      { email: 'test@wp.pl', name: 'test' },
      { name: '', email: '' },
    ],
    authorId: 1,
    inviteCode: 'ABC123',
    createdAt: new Date('2025-02-02T10:47:29.018Z'),
    updatedAt: new Date('2025-02-02T10:47:29.018Z'),
    board: {
      id: 1,
      name: 'Test Board',
      authorId: 1,
      inviteCode: 'ABC123',
      createdAt: new Date('2025-02-02T10:47:29.018Z'),
      updatedAt: new Date('2025-02-02T10:47:29.018Z'),
    },
  };

  beforeEach(() => {
    (useWebSocket as jest.Mock).mockReturnValue({ sendMessage: mockSendMessage });
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it('renders the board name and participant count correctly', () => {
    const userId = 1;

    render(<BoardItem board={mockBoard} userId={userId} handleBoardDelete={mockHandleBoardDelete} />);

    expect(screen.getByText('Test Board')).toBeInTheDocument();
    expect(screen.getByText('Liczba uczestników: 2')).toBeInTheDocument();
  });

  it('calls handleJoinRoom when clicking on the board item', () => {
    const userId = 1;

    render(<BoardItem board={mockBoard} userId={userId} handleBoardDelete={mockHandleBoardDelete} />);

    fireEvent.click(screen.getByText('Test Board')); // Clicking the list item

    expect(mockSendMessage).toHaveBeenCalledWith({ type: 'join-room', roomId: 1 });
    expect(mockPush).toHaveBeenCalledWith('/board/1-Test Board');
  });

  it('does not render DeleteBoardDialog if the user is not the author', () => {
    const userId = 2;

    render(<BoardItem board={mockBoard} userId={userId} handleBoardDelete={mockHandleBoardDelete} />);

    expect(screen.queryByText('Delete')).toBeNull();
  });

  it('renders DeleteBoardDialog if the user is the author', () => {
    const userId = 1;

    render(<BoardItem board={mockBoard} userId={userId} handleBoardDelete={mockHandleBoardDelete} />);

    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('calls handleBoardDelete when the delete button is clicked', () => {
    const userId = 1;

    render(<BoardItem board={mockBoard} userId={userId} handleBoardDelete={mockHandleBoardDelete} />);

    fireEvent.click(screen.getByText('Delete'));

    expect(mockHandleBoardDelete).toHaveBeenCalledWith(1);
  });
});
