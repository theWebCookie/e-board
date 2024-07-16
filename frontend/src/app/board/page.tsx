'use client';
import { useState, useLayoutEffect, useEffect, useCallback } from 'react';
import Arrow from '@/components/Arrow/Arrow';
import BoardButton from '@/components/BoardButton/BoardButton';
import ToolPicker from '@/components/ToolPicker/ToolPicker';
import rough from 'roughjs';
import Chat from '@/components/Chat/Chat';
import { useRouter } from 'next/navigation';
import { adjustElementCoordinates, adjustmentRequired, createElement, drawElement, getMouseCoordinates, IElement, IEvent } from './utils';

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

const Board = () => {
  const [elements, setElements] = useState<IElement[]>([]);
  const [tool, setTool] = useState<string>('pointer');
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(true);
  const [selectedElement, setSelectedElement] = useState(null);
  const [action, setAction] = useState('none');

  const router = useRouter();
  const handleGoBack = useCallback(() => router.back(), [router]);

  useLayoutEffect(() => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    const roughCanvas = rough.canvas(canvas);

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.save();
    elements.forEach((element) => drawElement(roughCanvas, context, element));
    context.restore();
    setIsHidden(false);
  }, [elements, action]);

  useEffect(() => {
    setDimensions({ width: window.innerWidth, height: window.innerHeight });

    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const updateElement = (id: number, x1: number, y1: number, x2: number, y2: number, type: string) => {
    const elementsCopy: IElement[] = [...elements];

    switch (type) {
      case 'line':
      case 'circle':
      case 'diamond':
      case 'rectangle':
      case 'arrow':
        elementsCopy[id] = createElement(id, x1, y1, x2, y2, type);
        break;
      case 'pencil':
        elementsCopy[id].points = [...elementsCopy[id].points, { x: x2, y: y2 }];
        break;
      default:
        throw new Error(`Type not recognized: ${type}`);
    }
    setElements(elementsCopy);
  };

  const handleMouseDown = (event: IEvent) => {
    const { clientX, clientY } = getMouseCoordinates(event);
    const id = elements.length;
    const element = createElement(id, clientX, clientY, clientX, clientY, tool);
    setElements((prevState) => [...prevState, element]);
    setSelectedElement(element);

    setAction(tool === 'text' ? 'writing' : 'drawing');
  };

  const handleMouseMove = (event: IEvent) => {
    const { clientX, clientY } = getMouseCoordinates(event);
    if (action === 'drawing') {
      const index = elements.length - 1;
      const { x1, y1 } = elements[index];
      updateElement(index, x1, y1, clientX, clientY, tool);
    }
  };

  const handleMouseUp = () => {
    if (selectedElement) {
      const index = selectedElement.id;
      const { id, type } = elements[index];
      if (action === 'drawing' && adjustmentRequired(type)) {
        const { x1, y1, x2, y2 } = adjustElementCoordinates(elements[index]);
        updateElement(id, x1, y1, x2, y2, type);
      }
    }

    setAction('none');
    setSelectedElement(null);
  };

  const handleChatOpen = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className='w-full h-screen'>
      <canvas
        id='canvas'
        className='w-full h-full relative'
        width={dimensions.width}
        height={dimensions.height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      ></canvas>
      <div className='flex items-center justify-center absolute top-7 left-7 w-full'>
        <Arrow className='absolute left-2.5' fn={handleGoBack} />
        <ToolPicker className='flex justify-center flex-grow mx-auto' tools={tools} activeTool={tool} setActiveTool={setTool} />
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
      <BoardButton className='absolute bottom-7 left-7' alt='board-button' path='/board-button.svg' />
    </div>
  );
};

export default Board;
