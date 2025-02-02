import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DeleteBoardDialog from '../DeleteBoardDialog';

jest.mock('../../ui/toaster', () => ({
  Toaster: jest.fn(() => null),
}));

describe('DeleteBoardDialog', () => {
  const mockHandleBoardDelete = jest.fn();
  const boardId = 1;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the DeleteBoardDialog and triggers the dialog on button click', async () => {
    render(<DeleteBoardDialog boardId={boardId} handleBoardDelete={mockHandleBoardDelete} />);

    const trashButton = screen.getByRole('button', { name: /trash/i });
    expect(trashButton).toBeInTheDocument();

    fireEvent.click(trashButton);

    await waitFor(() => screen.getByText('Usuń Tablicę'));

    expect(screen.getByText('Usuń Tablicę')).toBeInTheDocument();
    expect(screen.getByText('Czy jesteś pewny, że chcesz usunąć tę tablicę? Ta operacja nie może być cofnięta.')).toBeInTheDocument();
  });

  it('calls handleBoardDelete when "Usuń" is clicked', async () => {
    render(<DeleteBoardDialog boardId={boardId} handleBoardDelete={mockHandleBoardDelete} />);

    fireEvent.click(screen.getByRole('button', { name: /trash/i }));

    await waitFor(() => screen.getByText('Usuń Tablicę'));

    fireEvent.click(screen.getByRole('button', { name: /usuń/i }));

    expect(mockHandleBoardDelete).toHaveBeenCalledWith(boardId);
  });

  it('closes the dialog when "Anuluj" is clicked', async () => {
    render(<DeleteBoardDialog boardId={boardId} handleBoardDelete={mockHandleBoardDelete} />);

    fireEvent.click(screen.getByRole('button', { name: /trash/i }));

    await waitFor(() => screen.getByText('Usuń Tablicę'));

    fireEvent.click(screen.getByRole('button', { name: /anuluj/i }));

    expect(screen.queryByText('Usuń Tablicę')).not.toBeInTheDocument();
  });

  it('does not call handleBoardDelete if canceled', async () => {
    render(<DeleteBoardDialog boardId={boardId} handleBoardDelete={mockHandleBoardDelete} />);

    fireEvent.click(screen.getByRole('button', { name: /trash/i }));

    await waitFor(() => screen.getByText('Usuń Tablicę'));

    fireEvent.click(screen.getByRole('button', { name: /anuluj/i }));

    expect(mockHandleBoardDelete).not.toHaveBeenCalled();
  });
});
