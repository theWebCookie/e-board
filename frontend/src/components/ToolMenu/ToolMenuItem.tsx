import { IOptions, useBoard } from '@/app/board/[id]/page';
import MenuInput from './MenuInput';
import { ChangeEvent, useState } from 'react';

export interface ActiveTools extends Record<string, any> {
  stroke: string;
  fill: string;
  strokeWidth: string;
  strokeLineDash: string;
  roughness: string;
  fontSize: string;
}

interface ToolMenuItemProps {
  text: string;
  key: number;
  buttons?: { image: string; value: string }[] | [];
  colors?: string[];
  name: string;
  opacity?: number;
  setActiveTools: (activeTools: ActiveTools) => void;
  activeTools: ActiveTools;
}

const ToolMenuItem: React.FC<ToolMenuItemProps> = ({ text, buttons, colors, name, opacity, setActiveTools, activeTools }) => {
  const [value, setValue] = useState<number>(1);
  const { options, setOptions } = useBoard();

  const handleOpacityChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(Number(e.target.value));
    const updatedOptions: IOptions = { ...options, [name]: e.target.value };
    setOptions(updatedOptions);
  };

  if (buttons) {
    return (
      <li className='mt-2'>
        <h3 className='font-normal text-[#1b1b1f] m-0 mb-1'>{text}</h3>
        <div className='flex space-x-1'>
          {buttons.map((button, idx) => (
            <MenuInput
              key={idx}
              value={button.value}
              image={button.image}
              name={name}
              id={`${name}-${idx}`}
              setActiveTools={setActiveTools}
              activeTools={activeTools}
            />
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
            <MenuInput
              key={idx}
              value={color}
              color={color}
              name={name}
              id={`${name}-${idx}`}
              setActiveTools={setActiveTools}
              activeTools={activeTools}
            />
          ))}
        </div>
      </li>
    );
  }

  if (opacity) {
    return (
      <li className='mt-2'>
        <h3 className='font-normal text-[#1b1b1f] m-0 mb-1'>{text}</h3>
        <input type='range' min='0' max='1' step='0.01' value={value} onChange={(e) => handleOpacityChange(e)} className='w-full' />
      </li>
    );
  }
};

export default ToolMenuItem;
