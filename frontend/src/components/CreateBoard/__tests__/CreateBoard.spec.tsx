import { fireEvent, render, screen } from '@testing-library/react';
import CreateBoard from '../CreateBoard';

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
    expect(await screen.findByText('Nazwa jest wymagana')).toBeInTheDocument();
  });
});
