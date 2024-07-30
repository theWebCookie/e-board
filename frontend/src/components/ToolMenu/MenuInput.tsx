import { IOptions } from '@/app/board/page';
import Image from 'next/image';
import { ChangeEvent } from 'react';

interface MenuInputProps {
  className?: string;
  image?: string;
  color?: string;
  name: string;
  value: string;
  id: string;
  setOptions: (options: IOptions) => void;
  setActiveTools: (activeTools: { [key: string]: string }) => void;
  activeTools: { [key: string]: string };
}

const MenuInput: React.FC<MenuInputProps> = ({ className, image, name, color, value, id, setOptions, setActiveTools, activeTools }) => {
  const menuButtonStyles = `cursor-default appearance-auto pointer-events-none opacity-0 absolute mt-1 mr-1 ml-1 ${className}`;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOptions((prevOptions: IOptions) => ({ ...prevOptions, [name]: e.target.value }));
    setActiveTools((prevActiveTools: { [key: string]: string }) => ({ ...prevActiveTools, [name]: id }));
  };

  if (image) {
    return (
      <label className={`cursor-pointer rounded-sm p-1 transition duration-300 ${activeTools[name] === id ? 'bg-[#e0dfff]' : 'bg-[#ececf4]'}`}>
        <input type='radio' onChange={(e) => handleInputChange(e)} name={name} id={id} className={menuButtonStyles} value={value} />
        <Image src={image} width='20' height='20' alt={name} />
      </label>
    );
  }

  if (color) {
    return (
      <label className={`cursor-pointer rounded-sm p-1 ${activeTools[name] === id ? 'bg-[#e0dfff]' : 'bg-[#fff]'}`}>
        <input type='radio' onChange={(e) => handleInputChange(e)} name={name} id={id} className={menuButtonStyles} value={value} />
        <div className={`w-5 h-5`} style={{ backgroundColor: color }} title={color}></div>
      </label>
    );
  }
};

export default MenuInput;
