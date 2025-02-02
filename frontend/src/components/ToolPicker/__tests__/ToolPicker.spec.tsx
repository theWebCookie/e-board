import { render, screen } from '@testing-library/react';
import ToolPicker from '../ToolPicker';
import { useBoard } from '@/components/Board/BoardProvider';

jest.mock('@/components/Board/BoardProvider', () => ({
  useBoard: jest.fn(),
}));

describe('ToolPicker Component', () => {
  it('renders all tools correctly', () => {
    const toolsMock = [
      { icon: '/brush.png', name: 'Brush', type: 'brush' },
      { icon: '/eraser.png', name: 'Eraser', type: 'eraser' },
    ];
    (useBoard as jest.Mock).mockReturnValue({ tools: toolsMock, tool: 'brush' });

    render(<ToolPicker className='custom-class' />);

    expect(screen.getByRole('button', { name: /brush/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /eraser/i })).toBeInTheDocument();
  });
});
