import { render, screen } from '@testing-library/react';
import ToolMenu from '../ToolMenu';

describe('ToolMenu', () => {
  it('should render tool menu', () => {
    const mockOptions = {
      roughness: '0',
      stroke: '#000000',
      fill: 'transparent',
      strokeWidth: '1',
      strokeLineDash: '',
      opacity: '1',
      seed: 0,
    };

    render(<ToolMenu className='test' options={mockOptions} setOptions={() => {}} />);
    expect(screen.getByText('Szerokość obramowania')).toBeInTheDocument();
    expect(screen.getByText('Styl obramowania')).toBeInTheDocument();
    expect(screen.getByText('Styl elementu')).toBeInTheDocument();
    expect(screen.getByText('Przeźroczystość')).toBeInTheDocument();
  });
});
