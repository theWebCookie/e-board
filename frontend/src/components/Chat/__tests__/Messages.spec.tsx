import { render, screen } from '@testing-library/react';
import Messages from '../Messages';
import { IMessage } from '../Chat';
import '@testing-library/jest-dom';

describe('Messages Component', () => {
  beforeAll(() => {
    const scrollIntoViewMock = jest.fn();
    global.HTMLLIElement.prototype.scrollIntoView = scrollIntoViewMock;
  });

  const mockMessages: IMessage[] = [
    {
      message: 'Hello',
      clientId: 'client1',
      name: 'User 1',
      sentAt: '2025-02-02T12:00:00Z',
    },
    {
      message: 'Hi there',
      clientId: 'client2',
      name: 'User 2',
      sentAt: '2025-02-02T12:05:00Z',
    },
    {
      message: 'Hello',
      clientId: 'client1',
      name: 'User 1',
      sentAt: '2025-02-02T12:00:00Z',
    },
  ];

  it('renders the messages correctly', () => {
    render(<Messages messages={mockMessages} currentClientId='client1' />);

    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Hi there')).toBeInTheDocument();
    expect(screen.queryByText('Hello')).toBeInTheDocument();
  });

  it('filters out duplicate messages', () => {
    render(<Messages messages={mockMessages} currentClientId='client1' />);

    const helloMessages = screen.queryAllByText('Hello');
    expect(helloMessages).toHaveLength(1);
  });

  it("highlights the current client's messages on the right", () => {
    render(<Messages messages={mockMessages} currentClientId='client1' />);

    const helloMessage = screen.getByText('Hello');

    expect(helloMessage.closest('li')).toHaveClass('ml-auto');
  });
});
