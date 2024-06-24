'use client';
import './ToolPicker.css';
import Tool from './Tool';
import { ITool } from '@/app/board/page';
interface IToolPicker {
  tools: ITool[];
  activeTool: string | null;
  setActiveTool: (toolType: string) => void;
}

const ToolPicker: React.FC<IToolPicker> = ({ tools, activeTool, setActiveTool }) => {
  return (
    <div className='tool-picker'>
      {tools.map((tool, idx) => (
        <Tool key={idx} icon={tool.icon} name={tool.name} active={activeTool === tool.type} toolType={tool.type} setActiveTool={setActiveTool} />
      ))}
    </div>
  );
};

export default ToolPicker;
