import { fireEvent, render, screen } from '@testing-library/react';
import Nav from '../Nav';

describe('Nav', () => {
  it('should render navigiation', () => {
    render(<Nav />);
    expect(screen.getByText('Tablica')).toBeInTheDocument();
    expect(screen.getByText('Historia')).toBeInTheDocument();
    expect(screen.getByText('Profil')).toBeInTheDocument();
  });
});
