import { IOptions } from '@/app/board/page';
import MenuInput from './MenuInput';

interface ToolMenuItemProps {
  text: string;
  key: number;
  buttons?: { image: string; value: string }[] | [];
  colors?: string[];
  name: string;
  opacity?: number;
  options: IOptions;
  setOptions: (options: IOptions) => void;
}

const ToolMenuItem: React.FC<ToolMenuItemProps> = ({ text, buttons, colors, name, opacity, options, setOptions }) => {
  if (buttons) {
    return (
      <li className='mt-2'>
        <h3 className='font-normal text-[#1b1b1f] m-0 mb-1'>{text}</h3>
        <div className='flex space-x-1'>
          {buttons.map((button, idx) => (
            <MenuInput key={idx} value={button.value} image={button.image} name={name} setOptions={setOptions} />
          ))}
        </div>
      </li>
    );
  }

  if (colors) {
    return (
      <li className='mt-2'>
        <h3 className='font-normal text-[#1b1b1f] m-0 mb-1'>{text}</h3>
        <div className='flex space-x-1'>
          {colors.map((color, idx) => (
            <MenuInput key={idx} value={color} color={color} name={name} setOptions={setOptions} />
          ))}
          <input
            type='color'
            className='cursor-pointer size-7 border-0 bg-transparent'
            value={name === 'fillColor' ? options.fill : options.stroke}
          />
        </div>
      </li>
    );
  }

  if (opacity) {
    return (
      <li className='mt-2'>
        <h3 className='font-normal text-[#1b1b1f] m-0 mb-1'>{text}</h3>
        <input type='range' min='0' max='1' step='0.1' value={opacity} className='w-full' />
      </li>
    );
  }
};

export default ToolMenuItem;
