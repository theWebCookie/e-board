import { useBoard } from '@/components/Board/BoardProvider';
import { render, screen, fireEvent } from '@testing-library/react';
import Tool from '../Tool';

jest.mock('../../Board/BoardProvider', () => ({
  useBoard: jest.fn(),
}));

describe('Tool Component', () => {
  let setToolMock: jest.Mock, setImageDataMock: jest.Mock;

  beforeEach(() => {
    setToolMock = jest.fn();
    setImageDataMock = jest.fn();
    (useBoard as jest.Mock).mockReturnValue({ setTool: setToolMock, setImageData: setImageDataMock });
  });

  it('renders tool button with correct icon and name', () => {
    render(<Tool icon='/icon.png' name='Brush' active={false} toolType='brush' />);
    const button = screen.getByRole('button', { name: /brush/i });
    expect(button).toBeInTheDocument();
    expect(screen.getByAltText('Brush')).toBeInTheDocument();
  });

  it('calls setTool when clicked if not active', () => {
    render(<Tool icon='/icon.png' name='Brush' active={false} toolType='brush' />);
    const button = screen.getByRole('button', { name: /brush/i });
    fireEvent.click(button);
    expect(setToolMock).toHaveBeenCalledWith('brush');
  });

  it('does not call setTool when clicked if already active', () => {
    render(<Tool icon='/icon.png' name='Brush' active={true} toolType='brush' />);
    const button = screen.getByRole('button', { name: /brush/i });
    fireEvent.click(button);
    expect(setToolMock).not.toHaveBeenCalled();
  });

  it('opens file input when image tool is clicked', () => {
    render(<Tool icon='/icon.png' name='Image' active={false} toolType='image' />);
    const input = screen.getByLabelText('image');
    jest.spyOn(input, 'click');
    fireEvent.click(screen.getByRole('button', { name: /image/i }));
    expect(input.click).toHaveBeenCalled();
  });
});
