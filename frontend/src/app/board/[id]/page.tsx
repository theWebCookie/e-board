'use client';
import { useState, useCallback, useEffect } from 'react';
import Arrow from '@/components/Arrow/Arrow';
import BoardButton from '@/components/BoardButton/BoardButton';
import ToolPicker from '@/components/ToolPicker/ToolPicker';
import Chat from '@/components/Chat/Chat';
import { useRouter } from 'next/navigation';
import ToolMenu from '@/components/ToolMenu/ToolMenu';
import { defaultOptions } from '@config';
import Canvas from '@/components/Canvas/Canvas';

export interface ITool {
  name: string;
  icon: string;
  type: string;
}

const tools: ITool[] = [
  { name: 'Wskaźnik', icon: '/pointer.svg', type: 'pointer' },
  { name: 'Prostokąt', icon: '/rectangle.svg', type: 'rectangle' },
  { name: 'Diament', icon: '/diamond.svg', type: 'diamond' },
  { name: 'Okrąg', icon: '/circle.svg', type: 'circle' },
  { name: 'Strzałka', icon: '/arrow.svg', type: 'arrow' },
  { name: 'Linia', icon: '/line.svg', type: 'line' },
  { name: 'Rysuj', icon: '/marker.svg', type: 'pencil' },
  { name: 'Tekst', icon: '/text.svg', type: 'text' },
  { name: 'Obraz', icon: '/image.svg', type: 'image' },
  { name: 'Gumka', icon: '/eraser.svg', type: 'eraser' },
];

export interface IOptions {
  roughness: string;
  seed: number;
  fill: string;
  stroke: string;
  strokeWidth: string;
  strokeLineDash: string;
  opacity: string;
}

interface IBoardProps {
  params: { id: string };
}

const Board: React.FC<IBoardProps> = ({ params }) => {
  const [tool, setTool] = useState<string>('pointer');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(true);

  console.log(`Board id: ${params.id}`);
  const seed = Math.floor(Math.random() * 2 ** 31);
  const newOptions = { ...defaultOptions, seed };
  const [options, setOptions] = useState<IOptions>(newOptions);

  const router = useRouter();
  const handleGoBack = useCallback(() => router.back(), [router]);

  const handleChatOpen = () => {
    setIsChatOpen(!isChatOpen);
  };

  const isToolMenuOpen = tool === 'pointer' || tool === 'eraser' || tool === 'image' ? false : true;

  return (
    <div className='w-full h-screen'>
      <Canvas setIsHidden={setIsHidden} setTool={setTool} tool={tool} options={options} />
      <div className='flex items-center justify-center absolute top-7 left-7 w-full'>
        <Arrow className='absolute left-2.5' fn={handleGoBack} />
        <ToolPicker className='flex justify-center flex-grow mx-auto' activeTool={tool} setActiveTool={setTool} tools={tools} />
      </div>
      <Arrow
        className={`absolute right-0 bottom-1/2 translate-x-[-28px] translate-y-1/2 transition-transform ${
          isChatOpen ? 'translate-x-[-296px] rotate-180 z-10 bg-white size-12 rounded-full flex items-center justify-center' : ''
        }`}
        fn={handleChatOpen}
      />
      <Chat
        boardName='Mock Board'
        className={`absolute top-0 right-0 transition-transform ${isChatOpen ? 'translate-x-0' : 'translate-x-[20rem]'} ${isHidden ? 'hidden' : ''}`}
      />
      <ToolMenu className={`absolute top-1/3 left-7 border-2 rounded ${isToolMenuOpen ? '' : 'hidden'}`} options={options} setOptions={setOptions} />
      <BoardButton className='absolute bottom-7 left-7' alt='board-button' path='/board-button.svg' />
    </div>
  );
};

export default Board;
