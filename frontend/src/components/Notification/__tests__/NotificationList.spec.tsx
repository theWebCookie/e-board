import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { NotificationList } from '../NotificationList';

jest.mock('../../ui/use-toast', () => ({
  toast: jest.fn(),
}));

jest.mock('@/lib/cookies', () => ({
  getCookie: jest.fn(),
}));

jest.mock('../NotificationItem', () => ({
  NotificationItem: jest.fn(({ notification, handleNotificationDelete }) => (
    <div data-testid={`notification-${notification.id}`} onClick={() => handleNotificationDelete(notification.id)}>
      {notification.title}
    </div>
  )),
}));

jest.mock('jose', () => ({
  decodeJwt: jest.fn(),
}));

describe('NotificationList Component', () => {
  const mockNotifications = [
    { id: 1, title: 'New Notification 1', author: 'Author 1' },
    { id: 2, title: 'New Notification 2', author: 'Author 2' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows skeletons when loading notifications', () => {
    render(<NotificationList />);

    const skeletons = screen.getAllByRole('listitem');
    expect(skeletons).toHaveLength(3);
  });

  it('shows "No notifications" message when no notifications are available', async () => {
    global.fetch = jest.fn(
      () =>
        Promise.resolve({
          json: () => Promise.resolve([]),
          ok: true,
        }) as Promise<Response>
    );

    render(<NotificationList />);

    await waitFor(() => screen.getByText('Brak powiadomień'));
    expect(screen.getByText('Brak powiadomień')).toBeInTheDocument();
  });

  it('displays notifications after successful API call', async () => {
    global.fetch = jest.fn(
      () =>
        Promise.resolve({
          json: () => Promise.resolve(mockNotifications),
          ok: true,
        }) as Promise<Response>
    );

    render(<NotificationList />);

    await waitFor(() => screen.getByText(mockNotifications[0].title));
    expect(screen.getByText(mockNotifications[0].title)).toBeInTheDocument();
    expect(screen.getByText(mockNotifications[1].title)).toBeInTheDocument();
  });
});
