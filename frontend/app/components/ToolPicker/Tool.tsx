import Image from 'next/image';
import './Tool.css';

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
    <button className={`tool ${active ? 'active' : ''}`} onClick={handleToolClick} title={name}>
      <Image src={icon} width={20} height={20} alt={name} />
    </button>
  );
};

export default Tool;
