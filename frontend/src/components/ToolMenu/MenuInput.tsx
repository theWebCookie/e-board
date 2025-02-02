import Image from 'next/image';
import { ChangeEvent } from 'react';
import { ActiveTools } from './ToolMenuItem';
import { useBoard } from '../Board/BoardProvider';

interface MenuInputProps {
  className?: string;
  image?: string;
  color?: string;
  name: string;
  value: string;
  id: string;
  setActiveTools: (activeTools: any) => void;
  activeTools: ActiveTools;
}

const MenuInput: React.FC<MenuInputProps> = ({ className, image, name, color, value, id, setActiveTools, activeTools }) => {
  const { options, setOptions } = useBoard();
  const menuButtonStyles = `cursor-default appearance-auto pointer-events-none opacity-0 absolute mt-1 mr-1 ml-1 ${className}`;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const updatedOptions = { ...options, [name]: e.target.value };
    setOptions(updatedOptions);
    setActiveTools((prevActiveTools: ActiveTools) => ({ ...prevActiveTools, [name]: id }));
  };

  if (image) {
    let size = 20;

    if (name === 'fontSize') {
      size = parseInt(value, 10) - 4;
    }

    return (
      <label
        className={`cursor-pointer rounded-sm p-1 transition duration-300 flex justify-center ${
          activeTools[name] === id ? 'bg-[#e0dfff]' : 'bg-[#ececf4]'
        }`}
      >
        <input type='radio' onChange={(e) => handleInputChange(e)} name={name} id={id} className={menuButtonStyles} value={value} data-testid={id} />
        <Image src={image} width={size} height={size} alt={name} />
      </label>
    );
  }

  if (color) {
    return (
      <label className={`cursor-pointer rounded-sm p-1 ${activeTools[name] === id ? 'bg-[#e0dfff]' : 'bg-[#fff]'}`} aria-label='color'>
        <input type='radio' onChange={(e) => handleInputChange(e)} name={name} id={id} className={menuButtonStyles} value={value} data-testid={id} />
        <div className={`w-5 h-5`} style={{ backgroundColor: color }} title={color}></div>
      </label>
    );
  }
};

export default MenuInput;
