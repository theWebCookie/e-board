import { useBoard } from '@/app/board/[id]/page';
import Image from 'next/image';
import { ChangeEvent, useRef } from 'react';

interface ToolProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  name: string;
  active: boolean;
  toolType: string;
}

const Tool: React.FC<ToolProps> = ({ icon, name, active, toolType }) => {
  const { setTool, setImageData } = useBoard();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleToolClick = () => {
    if (!active) {
      setTool(toolType);

      if (toolType === 'image' && fileInputRef.current) {
        fileInputRef.current.click();
      }
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          const img = new window.Image();
          img.onload = () => {
            const width = img.naturalWidth;
            const height = img.naturalHeight;
            const data = reader.result as string;

            setImageData({ width, height, data });
          };
          img.src = reader.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
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
      {toolType === 'image' && <input type='file' accept='image/*' ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />}
    </>
  );
};

export default Tool;
