import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useBoard } from '@/components/Board/BoardProvider';
import ToolMenuItem from '../ToolMenuItem';

jest.mock('../../Board/BoardProvider', () => ({
  useBoard: jest.fn(),
}));

describe('ToolMenuItem Component', () => {
  let setActiveToolsMock: jest.Mock;
  let setOptionsMock: jest.Mock;

  beforeEach(() => {
    setActiveToolsMock = jest.fn();
    setOptionsMock = jest.fn();

    (useBoard as jest.Mock).mockReturnValue({
      options: {},
      setOptions: setOptionsMock,
    });
  });

  it('renders buttons correctly and interacts with them', () => {
    const buttons = [
      { image: '/brush.png', value: 'brush' },
      { image: '/eraser.png', value: 'eraser' },
    ];
    const activeTools = {
      tool: 'brush',
      stroke: '',
      fill: '',
      strokeWidth: '1',
      strokeLineDash: '',
      strokeOpacity: 1,
      roughness: '1',
      fontSize: '2',
    };

    render(<ToolMenuItem key={0} text='Tools' buttons={buttons} name='tool' setActiveTools={setActiveToolsMock} activeTools={activeTools} />);

    expect(screen.getByTestId('tool-0')).toBeInTheDocument();
    expect(screen.getByTestId('tool-1')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('tool-1'));

    expect(setActiveToolsMock).toHaveBeenCalledWith(expect.any(Function));

    const callback = setActiveToolsMock.mock.calls[0][0];
    const updatedState = callback(activeTools);

    expect(updatedState).toEqual(expect.objectContaining({ tool: 'tool-1' }));
  });

  it('renders colors correctly and interacts with them', () => {
    const colors = ['#ff0000', '#00ff00', '#0000ff'];
    const activeTools = {
      color: '#ff0000',
      stroke: '',
      fill: '',
      strokeWidth: '1',
      strokeLineDash: '',
      strokeOpacity: 1,
      roughness: '1',
      fontSize: '2',
    };

    render(<ToolMenuItem key={1} text='Colors' colors={colors} name='color' setActiveTools={setActiveToolsMock} activeTools={activeTools} />);

    expect(screen.getByTitle('#ff0000')).toBeInTheDocument();
    expect(screen.getByTitle('#00ff00')).toBeInTheDocument();
    expect(screen.getByTitle('#0000ff')).toBeInTheDocument();

    fireEvent.click(screen.getByTitle('#00ff00'));

    const callback = setActiveToolsMock.mock.calls[0][0];
    const updatedState = callback(activeTools);

    expect(updatedState).toEqual(expect.objectContaining({ color: 'color-1' }));
  });

  it('handles opacity change correctly', () => {
    const activeTools = {
      tool: 'brush',
      stroke: '',
      fill: '',
      strokeWidth: '1',
      strokeLineDash: '',
      strokeOpacity: 0.5,
      roughness: '1',
      fontSize: '2',
    };

    render(<ToolMenuItem key={2} text='Opacity' opacity={0.5} name='opacity' setActiveTools={setActiveToolsMock} activeTools={activeTools} />);

    const opacityInput = screen.getByRole('slider');
    expect(opacityInput).toBeInTheDocument();

    fireEvent.change(opacityInput, { target: { value: '0.75' } });

    expect(setOptionsMock).toHaveBeenCalledWith(expect.objectContaining({ opacity: '0.75' }));
  });
});
