'use client';
import Tool from './Tool';
import { useBoard } from '@/app/board/[id]/page';
interface ToolPickerProps {
  className?: string;
}

const ToolPicker: React.FC<ToolPickerProps> = ({ className }) => {
  const { tools, tool } = useBoard();
  return (
    <div className={`flex flex-wrap gap-2.5 py-2.5 px-4 bg-white rounded-md shadow max-w-md my-4 m-auto ${className}`}>
      {tools.map((item, idx) => (
        <Tool key={idx} icon={item.icon} name={item.name} active={tool === item.type} toolType={item.type} />
      ))}
    </div>
  );
};

export default ToolPicker;
