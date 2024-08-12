'use client';
import { useState, useLayoutEffect, useEffect, useCallback } from 'react';
import Arrow from '@/components/Arrow/Arrow';
import BoardButton from '@/components/BoardButton/BoardButton';
import ToolPicker from '@/components/ToolPicker/ToolPicker';
import rough from 'roughjs';
import Chat from '@/components/Chat/Chat';
import { useRouter } from 'next/navigation';
import {
  adjustElementCoordinates,
  adjustmentRequired,
  createElement,
  cursorForPosition,
  drawElement,
  getElementAtPosition,
  getMouseCoordinates,
  IElement,
  resizedCoordinates,
} from '../utils';
import ToolMenu from '@/components/ToolMenu/ToolMenu';
import { defaultOptions } from '@config';
import useHistory from '../useHistory';

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
  const [elements, setElements, undo, redo] = useHistory([]);
  const [tool, setTool] = useState<string>('pointer');
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(true);
  const [selectedElement, setSelectedElement] = useState<IElement | null>(null);
  const [action, setAction] = useState('none');
  const [dataURL, setDataURL] = useState('');

  console.log(`Board id: ${params.id}`);
  const seed = Math.floor(Math.random() * 2 ** 31);
  const newOptions = { ...defaultOptions, seed };
  const [options, setOptions] = useState<IOptions>(newOptions);

  const router = useRouter();
  const handleGoBack = useCallback(() => router.back(), [router]);

  useEffect(() => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;

    const roughCanvas = rough.canvas(canvas);
    const url = canvas.toDataURL();
    setDataURL(url);

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.save();
    elements.forEach((element) => drawElement(roughCanvas, context, element));
    context.restore();
    setIsHidden(false);
  }, [elements, action]);

  useLayoutEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const img = new Image();
    img.src = dataURL;
    img.onload = function () {
      const canvas = document.getElementById('canvas') as HTMLCanvasElement;
      const context = canvas.getContext('2d') as CanvasRenderingContext2D;
      context.drawImage(img, 0, 0);
      console.log(canvas.toDataURL());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dimensions]);

  useEffect(() => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    console.log(canvas.toDataURL());
  }, [elements]);

  useEffect(() => {
    const undoRedoFunction = (event: React.KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'z') undo();
      if ((event.metaKey || event.ctrlKey) && event.key === 'y') redo();
    };

    document.addEventListener('keydown', undoRedoFunction as unknown as EventListener);
    return () => {
      document.removeEventListener('keydown', undoRedoFunction as unknown as EventListener);
    };
  }, [undo, redo]);

  const updateElement = (id: number, x1: number, y1: number, x2: number, y2: number, type: string) => {
    const elementsCopy: IElement[] = [...elements];

    switch (type) {
      case 'line':
      case 'circle':
      case 'diamond':
      case 'rectangle':
      case 'arrow':
        elementsCopy[id] = createElement(id, x1, y1, x2, y2, type, options);
        break;
      case 'pencil':
        elementsCopy[id].points = [...elementsCopy[id].points, { x: x2, y: y2 }];
        break;
      case 'text':
        break;
      default:
        throw new Error(`Type not recognized: ${type}`);
    }
    setElements(elementsCopy, true);
  };

  const handleMouseDown: React.MouseEventHandler<HTMLCanvasElement> = (event) => {
    const { clientX, clientY } = getMouseCoordinates(event);
    if (tool === 'pointer') {
      const element = getElementAtPosition(clientX, clientY, elements);
      if (element) {
        const offsetX = clientX - element.x1;
        const offsetY = clientY - element.y1;
        setSelectedElement({ ...element, offsetX, offsetY });
        setElements((prevState) => prevState);
        if (element.position === 'inside') {
          setAction('moving');
        } else {
          setAction('resize');
        }
      }
    } else {
      const id = elements.length;
      const element = createElement(id, clientX, clientY, clientX, clientY, tool, options);
      setElements((prevState) => [...prevState, element]);
      setSelectedElement(element);

      setAction(tool === 'text' ? 'writing' : 'drawing');
    }
  };

  const handleMouseMove: React.MouseEventHandler<HTMLCanvasElement> = (event) => {
    const { clientX, clientY } = getMouseCoordinates(event);
    if (tool === 'pointer') {
      const target = event.target as HTMLCanvasElement;
      const element = getElementAtPosition(clientX, clientY, elements);
      target.style.cursor = element ? cursorForPosition(element.position) : 'default';
    }
    if (action === 'drawing') {
      const index = elements.length - 1;
      const { x1, y1 } = elements[index];
      updateElement(index, x1, y1, clientX, clientY, tool);
    } else if (action === 'moving') {
      if (!selectedElement) return;
      const { id, x1, x2, y1, y2, type, offsetX, offsetY } = selectedElement;
      const width = x2 - x1;
      const height = y2 - y1;
      const newX1 = clientX - offsetX;
      const newY1 = clientY - offsetY;
      updateElement(id, newX1, newY1, newX1 + width, newY1 + height, type);
    } else if (action === 'resize') {
      if (!selectedElement) return;
      const { id, type, position, ...coordinates } = selectedElement;
      const { x1, y1, x2, y2 } = resizedCoordinates(clientX, clientY, position, coordinates);
      updateElement(id, x1, y1, x2, y2, type);
    }
  };

  const handleMouseUp: React.MouseEventHandler<HTMLCanvasElement> = () => {
    if (selectedElement) {
      const index = selectedElement.id;
      const { id, type } = elements[index];
      if ((action === 'drawing' && adjustmentRequired(type)) || action === 'resize') {
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

  const isToolMenuOpen = tool === 'pointer' || tool === 'eraser' || tool === 'image' ? false : true;

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
