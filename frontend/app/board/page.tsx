import Arrow from '../components/Arrow/Arrow';
import BoardButton from '../components/BoardButton/BoardButton';
import ToolPicker from '../components/ToolPicker/ToolPicker';
import './page.css';

const Board = () => {
  return (
    <div className='board'>
      <canvas></canvas>
      <div className='toolbar'>
        <Arrow className='arrow left' />
        <ToolPicker />
      </div>
      <Arrow className='arrow left chat-arrow' />
      <BoardButton className='menu' alt='board-button' path='/board-button.svg' />
    </div>
  );
};

export default Board;
