import useHistory from '@/components/Canvas/useHistory';
import {
  adjustElementCoordinates,
  adjustmentRequired,
  createElement,
  cursorForPosition,
  drawElement,
  getElementAtPosition,
  getMouseCoordinates,
  IElement,
  IPencilElement,
  ITextElement,
  resizedCoordinates,
  updateElement,
} from '@/app/board/utils';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import rough from 'roughjs';
import usePressedKeys from './usePressedKeys';
import { useBoard } from '../Board/BoardProvider';
import { useWebSocket } from '@/app/home/page';

interface CanvasProps {
  roomId: string;
  dbElements?: string;
}

const Canvas: React.FC<CanvasProps> = ({ roomId, dbElements }) => {
  const { setIsHidden, setTool, tool, options, imageData } = useBoard();
  const { state: elements, setState: setElements, undo, redo } = useHistory<IElement[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [selectedElement, setSelectedElement] = useState<IElement | null>(null);
  const [action, setAction] = useState('none');
  const [dataURL, setDataURL] = useState('');
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [startPanMousePosition, setStartPanMousePosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [scaleOffset, setScaleOffset] = useState({ x: 0, y: 0 });
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const pressedKeys = usePressedKeys();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [elementsToErase, setElementsToErase] = useState<Set<IElement | number>>(new Set());
  const [erasePath, setErasePath] = useState<{ x: number; y: number }[]>([]);
  const [elementsLoaded, setElementsLoaded] = useState(false);

  const { ws, sendMessage, receivedElements, clientId } = useWebSocket();

  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout | null = null;
    return (...args: any[]) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  useEffect(() => {
    if (dbElements) {
      try {
        const parsedElements: IElement[] = JSON.parse(dbElements);
        setElements((prevState) => {
          const existingIds = new Set(prevState.map((el) => el.id));
          const newElements = parsedElements.filter((el) => !existingIds.has(el.id));
          return [...prevState, ...newElements];
        });
        setElementsLoaded(!elementsLoaded);
      } catch (error) {
        console.error('Error parsing dbElements:', error);
      }
    }
  }, [dbElements]);

  useLayoutEffect(() => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    const roughCanvas = rough.canvas(canvas);

    const url = canvas.toDataURL();
    setDataURL(url);

    context.font = '24px Pacifico, cursive';
    context.clearRect(0, 0, canvas.width, canvas.height);

    const scaledWidth = canvas.width * scale;
    const scaledHeight = canvas.height * scale;
    const scaleOffsetX = (scaledWidth - canvas.width) / 2;
    const scaleOffsetY = (scaledHeight - canvas.height) / 2;
    setScaleOffset({ x: scaleOffsetX, y: scaleOffsetY });

    context.save();
    context.translate(panOffset.x * scale - scaleOffsetX, panOffset.y * scale - scaleOffsetY);
    context.scale(scale, scale);

    [...elements, ...receivedElements].forEach((element) => {
      drawElement(roughCanvas, context, element);
    });

    context.restore();

    setIsHidden(false);
  }, [elements, receivedElements, action, selectedElement, panOffset, scale, setIsHidden]);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  useEffect(() => {
    const textArea = textAreaRef.current;
    if (action === 'writing') {
      if (!textArea) return;
      setTimeout(() => {
        textArea.focus();
        textArea.value = (selectedElement as ITextElement)?.text ?? '';
      }, 0);
    }
  }, [action, selectedElement]);

  useEffect(() => {
    const img = new Image();
    img.src = dataURL;
    img.onload = function () {
      const canvas = document.getElementById('canvas') as HTMLCanvasElement;
      const context = canvas.getContext('2d') as CanvasRenderingContext2D;
      context.drawImage(img, 0, 0);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dimensions]);

  useEffect(() => {
    // const sendCanvasData = debounce(async () => {
    const sendCanvasData = () => {
      if (ws && ws.readyState === ws.OPEN) {
        const canvasData = {
          type: 'canvas',
          elements: JSON.stringify(elements),
          clientId,
          roomId,
        };
        sendMessage(canvasData);
      }
      // }, 1000);
    };
    sendCanvasData();
  }, [elements]);

  useEffect(() => {
    const panOrZoomFunction = (event: WheelEvent) => {
      if (pressedKeys.has('Meta') || pressedKeys.has('Control')) {
        event.preventDefault();
        onZoom(event.deltaY * -0.001);
        return;
      }
      setPanOffset((prevState) => ({
        x: prevState.x - event.deltaX,
        y: prevState.y - event.deltaY,
      }));
    };
    document.addEventListener('wheel', panOrZoomFunction, { passive: false });
    return () => {
      document.removeEventListener('wheel', panOrZoomFunction);
    };
  }, [pressedKeys]);

  const handleMouseDown: React.MouseEventHandler<HTMLCanvasElement> = (event) => {
    if (action === 'writing') return;

    if (tool === 'eraser') {
      setAction('erasing');
      setElementsToErase(new Set());
      setErasePath([]);
      return;
    }

    const { clientX, clientY } = getMouseCoordinates(event, panOffset, scaleOffset, scale);

    if (event.button === 1 || pressedKeys.has(' ')) {
      const target = event.target as HTMLCanvasElement;
      target.style.cursor = 'grab';
      setTool('pointer');
      setAction('panning');
      setStartPanMousePosition({ x: clientX, y: clientY });
      return;
    }

    if (tool === 'pointer') {
      const element = getElementAtPosition(clientX, clientY, elements);
      if (element) {
        if (element.type === 'pencil') {
          const pencilElement = element as IPencilElement;
          const xOffsetX = pencilElement.points.map((point) => clientX - point.x);
          const yOffsetY = pencilElement.points.map((point) => clientY - point.y);
          setSelectedElement({ ...pencilElement, xOffsetX, yOffsetY });
        } else {
          const otherElement = element as IElement;
          const offsetX = clientX - otherElement.x1;
          const offsetY = clientY - otherElement.y1;
          setSelectedElement({ ...otherElement, offsetX, offsetY });
        }
        setElements((prevState: any) => prevState);

        if (element.position === 'inside') {
          setAction('moving');
        } else {
          setAction('resize');
        }
      }
    } else {
      if (tool === 'image' && imageData) {
        const imgWidth = imageData.width;
        const imgHeight = imageData.height;
        const centerX = clientX;
        const centerY = clientY;

        const x1 = centerX - imgWidth / 2;
        const y1 = centerY - imgHeight / 2;
        const x2 = x1 + imgWidth;
        const y2 = y1 + imgHeight;

        const id = elements.length;
        const imageElement = createElement(id, x1, y1, x2, y2, 'image', null, imageData);
        setElements((prevState) => [...prevState, imageElement]);
        setSelectedElement(imageElement);
        return;
      }
      const id = elements.length;
      const element = createElement(id, clientX, clientY, clientX, clientY, tool, options);
      setElements((prevState) => [...prevState, element]);
      setSelectedElement(element);

      setAction(tool === 'text' ? 'writing' : 'drawing');
    }
  };

  const handleMouseMove: React.MouseEventHandler<HTMLCanvasElement> = (event) => {
    const { clientX, clientY } = getMouseCoordinates(event, panOffset, scaleOffset, scale);

    if (action === 'erasing') {
      const updatedElementsToErase = new Set(elementsToErase);
      const element = getElementAtPosition(clientX, clientY, elements);

      if (element) {
        updatedElementsToErase.add(element.id);
      }

      setElementsToErase(updatedElementsToErase);

      const newPoint = { x: clientX, y: clientY };
      setErasePath((prevPath) => [...prevPath.slice(-1), newPoint]);

      if (!canvasRef.current) return;

      const context = canvasRef.current.getContext('2d');

      if (!context) return;

      context.strokeStyle = '#c2c4c3';
      context.lineWidth = 4;
      context.beginPath();
      if (erasePath.length > 0) {
        const lastPoint = erasePath[0];
        context.moveTo(lastPoint.x, lastPoint.y);
      }
      context.lineTo(newPoint.x, newPoint.y);
      context.stroke();
      return;
    }

    const target = event.target as HTMLCanvasElement;
    let cursorType = 'default';

    if (tool === 'pointer' && action === 'panning') {
      cursorType = 'grab';
    } else if (tool === 'pointer' && (action === 'none' || action === 'panning')) {
      const element = getElementAtPosition(clientX, clientY, elements);
      cursorType = element ? cursorForPosition(element.position) : 'default';
    } else if (tool === 'text') {
      cursorType = 'text';
    } else {
      cursorType = 'crosshair';
    }

    target.style.cursor = cursorType;

    if (action === 'moving' && selectedElement?.type === 'image') {
      const { id, x1, y1, x2, y2 } = selectedElement;
      const width = x2 - x1;
      const height = y2 - y1;
      const newX1 = clientX - (selectedElement.offsetX ?? 0);
      const newY1 = clientY - (selectedElement.offsetY ?? 0);
      updateElement(elements, id, newX1, newY1, newX1 + width, newY1 + height, 'image', null, options, setElements);
      return;
    }

    if (action === 'resize' && selectedElement?.type === 'image') {
      const { id, position } = selectedElement;
      const { x1, y1, x2, y2 } = resizedCoordinates(clientX, clientY, position!, selectedElement);
      updateElement(elements, id, x1, y1, x2, y2, 'image', null, options, setElements);
      return;
    }

    if (action === 'panning') {
      const deltaX = clientX - startPanMousePosition.x;
      const deltaY = clientY - startPanMousePosition.y;
      setPanOffset((prevState) => ({
        x: prevState.x + deltaX,
        y: prevState.y + deltaY,
      }));
      return;
    }

    if (action === 'drawing') {
      const index = elements.length - 1;
      const { x1, y1 } = elements[index];
      updateElement(elements, index, x1, y1, clientX, clientY, tool, null, options, setElements);
    } else if (action === 'moving') {
      if (!selectedElement) return;
      if (selectedElement.type === 'pencil') {
        const pencilElement = selectedElement as IPencilElement;
        const newPoints = pencilElement.points.map((_, index) => ({
          x: clientX - pencilElement.xOffsetX[index],
          y: clientY - pencilElement.yOffsetY[index],
        }));
        const elementsCopy = [...elements];
        elementsCopy[pencilElement.id] = {
          ...(elementsCopy[pencilElement.id] as IPencilElement),
          points: newPoints,
        };
        setElements(elementsCopy, true);
      } else {
        const { id, x1, x2, y1, y2, type, offsetX, offsetY } = selectedElement;
        const width = x2 - x1;
        const height = y2 - y1;
        if (!offsetX || !offsetY) return;
        const newX1 = clientX - offsetX;
        const newY1 = clientY - offsetY;
        const textOptions = type === 'text' ? { text: (selectedElement as ITextElement).text } : {};
        updateElement(elements, id, newX1, newY1, newX1 + width, newY1 + height, type, textOptions, options, setElements);
      }
    } else if (action === 'resize') {
      if (!selectedElement) return;
      const { id, type, position, ...coordinates } = selectedElement;
      const { x1, y1, x2, y2 } = resizedCoordinates(clientX, clientY, position ?? undefined, coordinates);
      updateElement(elements, id, x1, y1, x2, y2, type, null, options, setElements);
    }
  };

  const handleMouseUp: React.MouseEventHandler<HTMLCanvasElement> = (event) => {
    const { clientX, clientY } = getMouseCoordinates(event, panOffset, scaleOffset, scale);

    if (action === 'erasing') {
      setElements((prevElements) => prevElements.filter((element) => !elementsToErase.has(element.id)));
      setAction('none');
      setErasePath([]);
      return;
    }

    if (selectedElement) {
      if (
        selectedElement.type === 'text' &&
        clientX - ((selectedElement as ITextElement).offsetX ?? 0) === selectedElement.x1 &&
        clientY - ((selectedElement as ITextElement).offsetY ?? 0) === selectedElement.y1
      ) {
        setAction('writing');
        return;
      }

      const index = selectedElement.id;
      const { id, type } = elements[index];
      if ((action === 'drawing' || action === 'resize') && adjustmentRequired(type)) {
        const { x1, y1, x2, y2 } = adjustElementCoordinates(elements[index]);
        updateElement(elements, id, x1, y1, x2, y2, type, null, options, setElements);
      }
    }

    if (action === 'writing') return;

    setAction('none');
    setSelectedElement(null);
  };

  const handleBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    const { id, x1, y1, type } = selectedElement as IElement;
    setAction('none');
    setSelectedElement(null);
    updateElement(elements, id, x1, y1, null, null, type, { text: event.target.value }, options, setElements);
  };

  const onZoom = (delta: number) => {
    setScale((prevState) => Math.min(Math.max(prevState + delta, 0.1), 2));
  };

  return (
    <>
      <canvas
        id='canvas'
        className='w-4/5 h-screen relative'
        width={dimensions.width}
        height={dimensions.height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        ref={canvasRef}
      ></canvas>
      {action === 'writing' ? (
        <textarea
          ref={textAreaRef}
          onBlur={handleBlur}
          style={{
            position: 'fixed',
            top: selectedElement!.y1 * scale + panOffset.y * scale - scaleOffset.y,
            left: selectedElement!.x1 * scale + panOffset.x * scale - scaleOffset.x,
            font: `${parseInt(options.fontSize) * scale}px Pacifico, cursive`,
            color: options.stroke,
            margin: 0,
            padding: 0,
            border: 0,
            outline: 0,
            resize: 'both',
            overflow: 'hidden',
            whiteSpace: 'pre',
            background: 'transparent',
            zIndex: 2,
          }}
        />
      ) : null}
    </>
  );
};

export default Canvas;
