'use client';
import Tool from './Tool';
import { ITool } from '@/app/board/page';
interface ToolPickerProps {
  tools: ITool[];
  activeTool: string | null;
  setActiveTool: (toolType: string) => void;
  className?: string;
}

const ToolPicker: React.FC<ToolPickerProps> = ({ tools, activeTool, setActiveTool, className }) => {
  return (
    <div className={`flex flex-wrap gap-2.5 py-2.5 px-4 bg-white rounded-md shadow max-w-md my-4 m-auto ${className}`}>
      {tools.map((tool, idx) => (
        <Tool key={idx} icon={tool.icon} name={tool.name} active={activeTool === tool.type} toolType={tool.type} setActiveTool={setActiveTool} />
      ))}
    </div>
  );
};

export default ToolPicker;
