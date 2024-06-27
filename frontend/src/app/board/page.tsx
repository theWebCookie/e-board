'use client';
import { useState, useLayoutEffect } from 'react';
import Arrow from '@/components/Arrow/Arrow';
import BoardButton from '@/components/BoardButton/BoardButton';
import ToolPicker from '@/components/ToolPicker/ToolPicker';
import './page.css';
import rough from 'roughjs';
import { Drawable } from 'roughjs/bin/core';
import { Point } from 'roughjs/bin/geometry';
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

interface IElement {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  roughElement: Drawable | undefined;
}

interface IEvent {
  clientX: number;
  clientY: number;
}

const generator = rough.generator();

function createElement(x1: number, y1: number, x2: number, y2: number, tool: string | null) {
  switch (tool) {
    case 'line':
      return { x1, y1, x2, y2, roughElement: generator.line(x1, y1, x2, y2) };
    case 'rectangle':
      return { x1, y1, x2, y2, roughElement: generator.rectangle(x1, y1, x2 - x1, y2 - y1) };
    case 'circle':
      return { x1, y1, x2, y2, roughElement: generator.circle(x1, y1, x2 - x1) };
    case 'diamond':
      const points = [
        [x1, y1 + (y2 - y1) / 2],
        [x1 + (x2 - x1) / 2, y1],
        [x2, y1 + (y2 - y1) / 2],
        [x1 + (x2 - x1) / 2, y2],
      ];
      return { x1, y1, x2, y2, roughElement: generator.polygon(points as Point[]) };
    default:
      return { x1, y1, x2, y2, roughElement: undefined };
  }
}

const Board = () => {
  const [elements, setElements] = useState<IElement[]>([]);
  const [drawing, setDrawing] = useState(false);
  const [activeTool, setActiveTool] = useState<string | null>('pointer');

  useLayoutEffect(() => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    context.clearRect(0, 0, canvas.width, canvas.height);
    const roughCanvas = rough.canvas(canvas);
    elements.forEach(({ roughElement }) => roughCanvas.draw(roughElement as Drawable));
  }, [elements]);

  const handleMouseDown = (event: IEvent) => {
    setDrawing(true);
    const { clientX, clientY } = event;
    const element = createElement(clientX, clientY, clientX, clientY, activeTool);
    setElements((prevState: IElement[]) => [...prevState, element]);
  };

  const handleMouseMove = (event: IEvent) => {
    if (!drawing || !activeTool) return;
    const { clientX, clientY } = event;
    const index = elements.length - 1;
    const { x1, y1 } = elements[index];
    const updatedElement = createElement(x1, y1, clientX, clientY, activeTool);
    const elementsCopy = [...elements];
    elementsCopy[index] = updatedElement;
    setElements(elementsCopy);
  };

  const handleMouseUp = () => {
    setDrawing(false);
  };

  return (
    <div className='board'>
      <canvas
        id='canvas'
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      ></canvas>
      <div className='toolbar'>
        <Arrow className='arrow left' />
        <ToolPicker tools={tools} activeTool={activeTool} setActiveTool={setActiveTool} />
      </div>
      <Arrow className='arrow left chat-arrow' />
      <BoardButton className='menu' alt='board-button' path='/board-button.svg' />
    </div>
  );
};

export default Board;
