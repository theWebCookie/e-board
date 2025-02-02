import { render, screen, fireEvent } from '@testing-library/react';
import MenuInput from '../MenuInput';
import { useBoard } from '../../Board/BoardProvider';

jest.mock('../../Board/BoardProvider', () => ({
  useBoard: jest.fn(),
}));

describe('MenuInput Component', () => {
  let setOptionsMock: jest.Mock<any, any, any>, setActiveToolsMock: jest.Mock<any, any, any>;

  beforeEach(() => {
    setOptionsMock = jest.fn();
    setActiveToolsMock = jest.fn();

    (useBoard as jest.Mock).mockReturnValue({
      options: {},
      setOptions: setOptionsMock,
    });
  });

  it('renders image-based input correctly', () => {
    render(
      <MenuInput
        name='tool'
        id='brush'
        image='/brush.png'
        value='brush'
        activeTools={{ tool: 'brush', stroke: '', fill: '', strokeWidth: '1', strokeLineDash: '', strokeOpacity: 1, roughness: '1', fontSize: '2' }}
        setActiveTools={setActiveToolsMock}
      />
    );
    expect(screen.getByRole('radio', { name: /tool/i })).toBeInTheDocument();
    expect(screen.getByAltText('tool')).toBeInTheDocument();
  });

  it('renders color-based input correctly', () => {
    render(
      <MenuInput
        name='color'
        id='red'
        color='#ff0000'
        value='red'
        activeTools={{ color: 'red', stroke: '', fill: '', strokeWidth: '1', strokeLineDash: '', strokeOpacity: 1, roughness: '1', fontSize: '2' }}
        setActiveTools={setActiveToolsMock}
      />
    );
    expect(screen.getByTitle('#ff0000')).toBeInTheDocument();
  });
});
