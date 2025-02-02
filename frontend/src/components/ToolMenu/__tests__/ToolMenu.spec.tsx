import { render, screen } from '@testing-library/react';
import ToolMenu from '../ToolMenu';

describe('ToolMenu', () => {
  it('should render tool menu', () => {
    render(<ToolMenu className='test' />);
    expect(screen.getByText('Szerokość obramowania')).toBeInTheDocument();
    expect(screen.getByText('Styl obramowania')).toBeInTheDocument();
    expect(screen.getByText('Styl elementu')).toBeInTheDocument();
    expect(screen.getByText('Przeźroczystość')).toBeInTheDocument();
  });
});
