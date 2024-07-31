import Image from 'next/image';

interface ToolProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  name: string;
  active: boolean;
  toolType: string;
  setActiveTool: (tool: string) => void;
}

const Tool: React.FC<ToolProps> = ({ icon, name, active, toolType, setActiveTool }) => {
  const handleToolClick = () => {
    if (!active) {
      setActiveTool(toolType);
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
