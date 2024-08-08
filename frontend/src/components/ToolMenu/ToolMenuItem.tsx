import { IOptions } from '@/app/board/[id]/page';
import MenuInput from './MenuInput';
import { ChangeEvent, useState } from 'react';

export interface ActiveTools extends Record<string, any> {
  stroke: string;
  fill: string;
  strokeWidth: string;
  strokeLineDash: string;
  roughness: string;
}

interface ToolMenuItemProps {
  text: string;
  key: number;
  buttons?: { image: string; value: string }[] | [];
  colors?: string[];
  name: string;
  opacity?: number;
  options: IOptions;
  setOptions: (options: any) => void;
  setActiveTools: (activeTools: ActiveTools) => void;
  activeTools: ActiveTools;
}

const ToolMenuItem: React.FC<ToolMenuItemProps> = ({ text, buttons, colors, name, opacity, options, setOptions, setActiveTools, activeTools }) => {
  const [value, setValue] = useState<number>(1);

  const handleOpacityChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(Number(e.target.value));
    setOptions((prevOptions: IOptions) => ({ ...prevOptions, [name]: e.target.value }));
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
              setOptions={setOptions}
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
              setOptions={setOptions}
              setActiveTools={setActiveTools}
              activeTools={activeTools}
            />
          ))}
          {name === 'fill' && (
            <input
              type='color'
              className='cursor-pointer size-7 border-0 bg-transparent'
              value={options.fill}
              onChange={(e) => setOptions((prevOptions: IOptions) => ({ ...prevOptions, [name]: e.target.value }))}
            />
          )}
          {name === 'stroke' && (
            <input
              type='color'
              className='cursor-pointer size-7 border-0 bg-transparent'
              value={options.stroke}
              onChange={(e) => setOptions((prevOptions: IOptions) => ({ ...prevOptions, [name]: e.target.value }))}
            />
          )}
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
