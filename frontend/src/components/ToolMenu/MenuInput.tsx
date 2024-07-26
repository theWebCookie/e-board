import Image from 'next/image';

interface MenuInputProps {
  className: string;
  image?: string;
  color?: string;
  name: string;
}

const MenuInput: React.FC<MenuInputProps> = ({ className, image, name, color }) => {
  const menuButtonStyles = `cursor-default appearance-auto pointer-events-none opacity-0 absolute mt-1 mr-1 ml-1 ${className}`;
  const active = true;

  if (image) {
    return (
      <label className={`rounded-sm p-1 transition duration-300 ${active ? 'bg-[#e0dfff]' : 'bg-[#ececf4]'}`}>
        <input type='radio' name={name} className={menuButtonStyles} />
        <Image src={image} width='20' height='20' alt={name} />
      </label>
    );
  }

  if (color) {
    return (
      <label className={`rounded-sm p-1 ${active ? 'border' : 'border-0'}`}>
        <input type='radio' name={name} className={menuButtonStyles} />
        <div className={`w-6 h-6`} style={{ backgroundColor: color }} title={color}></div>
      </label>
    );
  }
};

export default MenuInput;
