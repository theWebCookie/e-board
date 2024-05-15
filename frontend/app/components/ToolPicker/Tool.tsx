import Image from 'next/image';
import './Tool.css';

interface ToolProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  name: string;
  onToolClick: () => void;
  active: boolean;
}

const Tool: React.FC<ToolProps> = ({ icon, name, onToolClick, active }) => {
  return (
    <button className={`tool ${active && 'active'}`} onClick={onToolClick} title={name}>
      <Image src={icon} width={20} height={20} alt={name} />
    </button>
  );
};

export default Tool;
