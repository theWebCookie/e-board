import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import InviteFormCode from '../InviteCodeForm';
import { boardToastDictionary } from '@config';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const mockToast = jest.fn();

jest.mock('../../ui/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

jest.mock('../../ui/toaster', () => ({
  Toaster: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

global.fetch = jest.fn(
  () =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ boardId: '123', boardName: 'Test Board' }),
    }) as Promise<any>
);

jest.mock('../../ui/toaster', () => ({
  Toaster: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('InviteFormCode', () => {
  it('handles the form submission correctly', async () => {
    render(<InviteFormCode />);

    const input = screen.getByPlaceholderText('Kod tablicy') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '12345678' } });

    const submitButton = screen.getByText('Dołącz');
    fireEvent.click(submitButton);

    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('/api/invite', expect.any(Object)));

    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: boardToastDictionary['success-invite-toast-title'],
        description: 'Dołączono do tablicy',
      })
    );
  });

  it('handles API failure and shows error toast', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Invalid code' }),
    });

    render(<InviteFormCode />);

    const input = screen.getByPlaceholderText('Kod tablicy') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '12345678' } });

    const submitButton = screen.getByText('Dołącz');
    fireEvent.click(submitButton);

    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('/api/invite', expect.any(Object)));

    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: boardToastDictionary['fail-invite-toast-title'],
        description: 'Invalid code',
      })
    );
  });
});
