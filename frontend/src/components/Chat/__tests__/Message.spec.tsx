import { render, screen } from '@testing-library/react';
import Message from '../Message';
import '@testing-library/jest-dom';
import { IMessage } from '../Chat';

describe('Message Component', () => {
  const mockMessage: IMessage = {
    message: 'Hello, this is a test message',
    clientId: 'client1',
    name: 'Test User',
    sentAt: '2025-02-02T12:00:00Z',
  };

  it('renders the message content correctly', () => {
    render(<Message message={mockMessage} />);

    expect(screen.getByText(mockMessage.message)).toBeInTheDocument();
    expect(screen.getByText(mockMessage.name)).toBeInTheDocument();

    const formattedTime = new Date(mockMessage.sentAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }).toString();
    expect(screen.getByText(formattedTime)).toBeInTheDocument();

    const avatar = screen.getByAltText('Avatar');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', expect.stringMatching(/^\/_next\/image/));
  });

  it('applies the correct classes when isRight is true', () => {
    render(<Message message={mockMessage} isRight />);

    const messageBubble = screen.getByText(mockMessage.message).closest('li');
    expect(messageBubble).toHaveClass('ml-auto');

    const avatar = screen.getByAltText('Avatar');
    expect(avatar).toHaveClass('mr-4');
  });

  it('applies the correct classes when isRight is false (default)', () => {
    render(<Message message={mockMessage} />);

    const messageBubble = screen.getByText(mockMessage.message).closest('li');
    expect(messageBubble).not.toHaveClass('ml-auto');

    const avatar = screen.getByAltText('Avatar');
    expect(avatar).not.toHaveClass('mr-4');
  });

  it('formats the time correctly', () => {
    render(<Message message={mockMessage} />);

    const expectedTime = new Date(mockMessage.sentAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }).toString();
    expect(screen.getByText(expectedTime)).toBeInTheDocument();
  });
});
