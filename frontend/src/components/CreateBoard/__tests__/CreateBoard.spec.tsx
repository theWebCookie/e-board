import { fireEvent, render, screen } from '@testing-library/react';
import CreateBoard from '../CreateBoard';
import { createBoardSchemaErrorDictionary } from '@config';

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      prefetch: () => null,
    };
  },
}));

global.fetch = jest.fn(
  () =>
    Promise.resolve({
      json: () => Promise.resolve({ name: 'test' }),
      ok: true,
    }) as Promise<Response>
);

describe('CreateBoard', () => {
  it('should open create board dialog', async () => {
    render(<CreateBoard />);
    const createButton = screen.findByAltText('add button');
    fireEvent.click(await createButton);
    expect(screen.getByText('Stwórz tablicę')).toBeInTheDocument();
  });

  it('should show error message when create board form is empty', async () => {
    render(<CreateBoard />);
    const createButton = screen.findByAltText('add button');
    fireEvent.click(await createButton);
    const submitButton = screen.getByText('Stwórz');
    fireEvent.click(submitButton);
    expect(await screen.findByText(createBoardSchemaErrorDictionary['board-name-is-required'])).toBeInTheDocument();
  });
});
