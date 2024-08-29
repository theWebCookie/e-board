import { useBoard } from '@/app/board/[id]/page';
import Image from 'next/image';

interface ToolProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  name: string;
  active: boolean;
  toolType: string;
}

const Tool: React.FC<ToolProps> = ({ icon, name, active, toolType }) => {
  const { setTool } = useBoard();
  const handleToolClick = () => {
    if (!active) {
      setTool(toolType);
    }
  };

  return (
    <button
      className={`flex items-center justify-center border-none p-1 rounded-lg cursor-pointer mx-1.25 transition duration-300 ${
        active ? 'bg-[#e0dfff]' : 'bg-white hover:bg-[#ececf4]'
      }`}
      onClick={handleToolClick}
      title={name}
      type='button'
    >
      <Image src={icon} width={20} height={20} alt={name} priority={true} />
    </button>
  );
};

export default Tool;
