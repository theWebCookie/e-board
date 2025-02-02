import { render, screen, fireEvent, act } from '@testing-library/react';
import Chat from '../Chat';
import { useWebSocket } from '@/app/home/page';
import { getCookie } from '@/lib/cookies';
import '@testing-library/jest-dom';

jest.mock('@/app/home/page', () => ({
  useWebSocket: jest.fn(),
}));

jest.mock('@/lib/cookies', () => ({
  getCookie: jest.fn(),
}));

jest.mock('../Messages', () => ({
  __esModule: true,
  default: ({ messages }: { messages: any[] }) => (
    <div>
      {messages.map((msg, idx) => (
        <div key={idx}>{msg.message}</div>
      ))}
    </div>
  ),
}));

describe('Chat Component', () => {
  const mockSendMessage = jest.fn();
  const mockWs = { send: jest.fn() };
  const mockClientId = 'client123';

  const mockBoardName = 'Test Board';
  const mockRoomId = 'room123';
  const mockName = 'Test User';
  const mockDbMessages = [
    { message: 'Hello', clientId: 'client1', name: 'User 1', sentAt: '2025-02-02T12:00:00Z' },
    { message: 'Hi', clientId: 'client2', name: 'User 2', sentAt: '2025-02-02T12:01:00Z' },
  ];

  beforeEach(() => {
    (useWebSocket as jest.Mock).mockReturnValue({
      ws: mockWs,
      sendMessage: mockSendMessage,
      messages: [],
      clientId: mockClientId,
    });

    (getCookie as jest.Mock).mockReturnValue(mockClientId);
  });

  it('renders the chat component correctly', () => {
    render(<Chat boardName={mockBoardName} className='test-class' roomId={mockRoomId} name={mockName} dbMessages={mockDbMessages} />);

    expect(screen.getByText(mockBoardName)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Wiadomość..')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('renders messages correctly', () => {
    render(<Chat boardName={mockBoardName} className='test-class' roomId={mockRoomId} name={mockName} dbMessages={mockDbMessages} />);

    mockDbMessages.forEach((msg) => {
      expect(screen.getByText(msg.message)).toBeInTheDocument();
    });
  });

  it('calls sendMessage with correct data on form submission', async () => {
    render(<Chat boardName={mockBoardName} className='test-class' roomId={mockRoomId} name={mockName} dbMessages={mockDbMessages} />);

    const messageInput = screen.getByPlaceholderText('Wiadomość..');
    const sendButton = screen.getByRole('button');

    await fireEvent.change(messageInput, { target: { value: 'New message' } });

    await act(async () => fireEvent.click(sendButton));

    expect(mockSendMessage).toHaveBeenCalledWith({
      type: 'message',
      clientId: mockClientId,
      roomId: mockRoomId,
      message: {
        message: 'New message',
        name: mockName,
        sentAt: expect.any(Number),
      },
    });
  });

  it('disables the send button when the message input is empty', () => {
    render(<Chat boardName={mockBoardName} className='test-class' roomId={mockRoomId} name={mockName} dbMessages={mockDbMessages} />);

    const messageInput = screen.getByPlaceholderText('Wiadomość..');
    const sendButton = screen.getByRole('button');

    expect(sendButton).toBeDisabled();

    fireEvent.change(messageInput, { target: { value: 'New message' } });
    expect(sendButton).toBeEnabled();
  });
});
