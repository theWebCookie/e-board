import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { NotificationItem } from '../NotificationItem';

jest.mock('lucide-react', () => ({
  Bell: () => <svg data-testid='bell-icon' />,
  Trash: () => <svg data-testid='trash-icon' />,
}));

describe('NotificationItem Component', () => {
  let mockHandleNotificationDelete: jest.Mock;

  beforeEach(() => {
    mockHandleNotificationDelete = jest.fn();
  });

  it('renders notification title and author', () => {
    const notification = {
      id: 1,
      title: 'New Notification',
      author: 'Author Name',
    };

    render(<NotificationItem notification={notification} handleNotificationDelete={mockHandleNotificationDelete} />);

    expect(screen.getByText('New Notification')).toBeInTheDocument();
    expect(screen.getByText('Author Name')).toBeInTheDocument();
  });

  it('calls handleNotificationDelete when the delete button is clicked', () => {
    const notification = {
      id: 1,
      title: 'New Notification',
      author: 'Author Name',
    };

    render(<NotificationItem notification={notification} handleNotificationDelete={mockHandleNotificationDelete} />);

    const deleteButton = screen.getByTestId('trash-icon');
    fireEvent.click(deleteButton);

    expect(mockHandleNotificationDelete).toHaveBeenCalledWith(1);
  });

  it('renders the bell icon correctly', () => {
    const notification = {
      id: 1,
      title: 'New Notification',
      author: 'Author Name',
    };

    render(<NotificationItem notification={notification} handleNotificationDelete={mockHandleNotificationDelete} />);

    expect(screen.getByTestId('bell-icon')).toBeInTheDocument();
  });

  it('renders the delete button correctly', () => {
    const notification = {
      id: 1,
      title: 'New Notification',
      author: 'Author Name',
    };

    render(<NotificationItem notification={notification} handleNotificationDelete={mockHandleNotificationDelete} />);

    expect(screen.getByTestId('trash-icon')).toBeInTheDocument();
  });
});
