import getStroke from 'perfect-freehand';
import rough from 'roughjs';
import { RoughCanvas } from 'roughjs/bin/canvas';
import { Drawable } from 'roughjs/bin/core';
import { Point } from 'roughjs/bin/geometry';
import { IImageData, IOptions } from './[id]/page';
import { arrowHeadLength, bowingOptionValue } from '@config';

export interface IBaseElement {
  id: number;
  type: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  position?: string | null;
  newOptions: INewOptions;
  offsetX?: number;
  offsetY?: number;
}

export interface ILineElement extends IBaseElement {
  type: 'line';
  roughElement: Drawable;
  points: Point[];
}

export interface IRectangleElement extends IBaseElement {
  type: 'rectangle';
  roughElement: Drawable;
}

export interface ICircleElement extends IBaseElement {
  type: 'circle';
  roughElement: Drawable;
}

export interface IDiamondElement extends IBaseElement {
  type: 'diamond';
  roughElement: Drawable;
}

export interface IPencilElement extends IBaseElement {
  type: 'pencil';
  points: Point[];
  xOffsetX: number[];
  yOffsetY: number[];
}

export interface IArrowElement extends IBaseElement {
  type: 'arrow';
}

export interface ITextElement extends IBaseElement {
  type: 'text';
  text: string;
}

export interface IImageElement extends IBaseElement {
  typ: 'image';
  imageData: IImageData;
}

export interface IEvent extends MouseEvent {
  clientX: number;
  clientY: number;
}

export type IElement =
  | ILineElement
  | IRectangleElement
  | ICircleElement
  | IDiamondElement
  | IPencilElement
  | IArrowElement
  | ITextElement
  | IImageElement;

export interface IPoint {
  x: number;
  y: number;
}

const generator = rough.generator();

interface INewOptions {
  roughness: number;
  seed: number;
  bowing: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  fillStyle: string;
  strokeLineDash: number[];
  fontSize: number;
}

const pencilStrokeOptions = {
  size: 10,
  smoothing: 0.5,
  thinning: 0.5,
  streamline: 0.5,
  easing: (t: any) => t,
  start: {
    taper: 0,
    cap: true,
  },
  end: {
    taper: 0,
    cap: true,
  },
};

const formatOptions = (options: IOptions): INewOptions => ({
  bowing: bowingOptionValue,
  fillStyle: 'solid',
  roughness: parseFloat(options.roughness),
  seed: options.seed,
  fill: options.fill === 'transparent' ? 'rgba(0,0,0,0)' : convertedColor(options.fill, parseFloat(options.opacity)),
  stroke: convertedColor(options.stroke, parseFloat(options.opacity)),
  strokeWidth: parseInt(options.strokeWidth),
  strokeLineDash: options.strokeLineDash === '' ? [] : options.strokeLineDash.split(',').map((x) => parseInt(x)),
  fontSize: parseInt(options.fontSize),
});

const distance = (a: IPoint, b: IPoint) => Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

export const createElement = (
  id: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  type: string,
  options: IOptions | null = null,
  imageData: IImageData | null = null
): IElement => {
  const newOptions = options ? formatOptions(options) : null;

  switch (type) {
    case 'line':
      if (!newOptions) throw new Error('Options are required');
      return { id, type, x1, y1, x2, y2, roughElement: generator.line(x1, y1, x2, y2, newOptions) } as ILineElement;
    case 'rectangle':
      if (!newOptions) throw new Error('Options are required');
      return { id, type, x1, y1, x2, y2, roughElement: generator.rectangle(x1, y1, x2 - x1, y2 - y1, newOptions) } as IRectangleElement;
    case 'circle':
      if (!newOptions) throw new Error('Options are required');
      return { id, type, x1, y1, x2, y2, roughElement: generator.circle(x1, y1, x2 - x1, newOptions) } as ICircleElement;
    case 'diamond':
      const points = [
        [x1, y1 + (y2 - y1) / 2],
        [x1 + (x2 - x1) / 2, y1],
        [x2, y1 + (y2 - y1) / 2],
        [x1 + (x2 - x1) / 2, y2],
      ];
      if (!newOptions) throw new Error('Options are required');
      return { id, type, x1, y1, x2, y2, roughElement: generator.polygon(points as Point[], newOptions) } as IDiamondElement;
    case 'pencil':
      return { id, type, points: [{ x: x1, y: y1 }], newOptions } as unknown as IPencilElement;
    case 'arrow':
      return { id, type, x1, y1, x2, y2, newOptions } as IArrowElement;
    case 'text':
      return { id, type, x1, y1, x2, y2, text: '', newOptions } as ITextElement;
    case 'image':
      console.log({ id, type, x1, y1, x2, y2, imageData });
      if (!imageData) throw new Error('Image data is required');
      const imgX = x1 + imageData.width / 2;
      const imgY = y1 + imageData.height / 2;
      return { id, type, x1: imgX - imageData.width / 2, y1: imgY - imageData.height / 2, x2, y2, imageData } as IImageElement;
    default:
      throw new Error(`Type not recognized: ${type}`);
  }
};

export const getSvgPathFromStroke = (stroke: number[][]) => {
  if (!stroke.length) return '';
  const d = stroke.reduce(
    (acc, [x0, y0]: number[], i: number, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ['M', ...stroke[0], 'Q']
  );
  d.push('Z');
  return d.join(' ');
};

export const drawElement = (roughCanvas: RoughCanvas, context: CanvasRenderingContext2D | Path2D[], element: IElement) => {
  const { type } = element;
  switch (type) {
    case 'line':
    case 'rectangle':
    case 'diamond':
    case 'circle':
      roughCanvas.draw(element.roughElement);
      break;
    case 'pencil':
      const stroke = getSvgPathFromStroke(getStroke(element.points, pencilStrokeOptions));
      if (context instanceof CanvasRenderingContext2D) {
        context.fillStyle = element.newOptions.stroke;
        context.fill(new Path2D(stroke));
      }
      break;
    case 'arrow':
      const arrowStrokeColor = element.newOptions.stroke;
      const startX = element.x1;
      const startY = element.y1;
      const endX = element.x2;
      const endY = element.y2;
      const angle = Math.atan2(endY - startY, endX - startX);

      roughCanvas.line(startX, startY, endX, endY, { stroke: arrowStrokeColor, strokeWidth: 2, seed: 6 });
      roughCanvas.line(endX, endY, endX - arrowHeadLength * Math.cos(angle - Math.PI / 6), endY - arrowHeadLength * Math.sin(angle - Math.PI / 6), {
        stroke: arrowStrokeColor,
        strokeWidth: 2,
        seed: 6,
      });
      roughCanvas.line(endX, endY, endX - arrowHeadLength * Math.cos(angle + Math.PI / 6), endY - arrowHeadLength * Math.sin(angle + Math.PI / 6), {
        stroke: arrowStrokeColor,
        strokeWidth: 2,
        seed: 6,
      });
      break;
    case 'text':
      if (context instanceof CanvasRenderingContext2D) {
        context.textBaseline = 'top';
        context.font = `${element.newOptions.fontSize}px Pacifico, cursive`;
        context.fillStyle = element.newOptions.stroke;
        if (element.text) context.fillText(element.text, element.x1, element.y1);
      }
      break;
    case 'image':
      if (context instanceof CanvasRenderingContext2D) {
        const img = new Image();
        img.src = element.imageData.data;
        context.drawImage(img, element.x1, element.y1, element.imageData.width, element.imageData.height);
      }
      break;
    default:
      throw new Error(`Type not recognized: ${element.type}`);
  }
};

export const updateElement = (
  elements: IElement[],
  id: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  type: string,
  textOptions = null,
  options = null,
  setElements: (arg0: IElement[], arg1: boolean) => void,
  imageData: IImageData | null = null
) => {
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
      (elementsCopy[id] as IPencilElement).points = [...(elementsCopy[id] as IPencilElement).points, { x: x2, y: y2 }];
      break;
    case 'text':
      // @ts-ignore
      const textWidth = document.getElementById('canvas')!.getContext('2d').measureText(textOptions.text).width;
      const textHeight = 24;
      elementsCopy[id] = {
        ...createElement(id, x1, y1, x1 + textWidth, y1 + textHeight, type, options),
        text: textOptions.text,
      };
      break;
    case 'image':
      console.log({ ...elementsCopy[id], x1, y1, x2, y2, imageData });
      if (imageData) {
        elementsCopy[id] = { ...elementsCopy[id], x1, y1, x2, y2, imageData } as IImageElement;
      } else {
        elementsCopy[id] = { ...elementsCopy[id], x1, y1, x2, y2 } as IImageElement;
      }
      break;
    default:
      throw new Error(`Type not recognized: ${type}`);
  }
  setElements(elementsCopy, true);
};

export const getMouseCoordinates = (
  event: { clientX: number; clientY: number },
  panOffset: { x: number; y: number },
  scaleOffset: { x: number; y: number },
  scale: number
) => {
  const clientX = (event.clientX - panOffset.x * scale + scaleOffset.x) / scale;
  const clientY = (event.clientY - panOffset.y * scale + scaleOffset.y) / scale;
  return { clientX, clientY };
};

export const adjustmentRequired = (type: string) => ['line', 'rectangle'].includes(type);

export const adjustElementCoordinates = (element: IElement) => {
  const { type, x1, y1, x2, y2 } = element;
  if (type === 'rectangle') {
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);
    return { x1: minX, y1: minY, x2: maxX, y2: maxY };
  } else {
    if (x1 < x2 || (x1 === x2 && y1 < y2)) {
      return { x1, y1, x2, y2 };
    } else {
      return { x1: x2, y1: y2, x2: x1, y2: y1 };
    }
  }
};

export const getElementAtPosition = (x: number, y: number, elements: IElement[]) => {
  return elements.map((element) => ({ ...element, position: positionWithElement(x, y, element) })).find((element) => element.position !== null);
};

const onLine = (x1: number, y1: number, x2: number, y2: number, x: number, y: number, maxDistance = 1) => {
  const a = { x: x1, y: y1 };
  const b = { x: x2, y: y2 };
  const c = { x, y };
  const offset = distance(a, b) - (distance(a, c) + distance(b, c));
  return Math.abs(offset) < maxDistance ? 'inside' : null;
};

function positionWithElement(x: number, y: number, element: IElement) {
  const { x1, y1, x2, y2, type } = element;
  switch (type) {
    case 'line':
      const on = onLine(x1, y1, x2, y2, x, y);
      const start = nearPoint(x, y, x1, y1, 'start');
      const end = nearPoint(x, y, x2, y2, 'end');
      return start || end || on;
    case 'rectangle':
      const topLeft = nearPoint(x, y, x1, y1, 'tl');
      const topRight = nearPoint(x, y, x2, y1, 'tr');
      const bottomLeft = nearPoint(x, y, x1, y2, 'bl');
      const bottomRight = nearPoint(x, y, x2, y2, 'br');
      const insideRect = x >= x1 && x <= x2 && y >= y1 && y <= y2 ? 'inside' : null;
      return topLeft || topRight || bottomLeft || bottomRight || insideRect;
    case 'circle':
      const center = { x: x1, y: y1 };
      const radiusX = Math.abs((x2 - x1) / 2);
      const radiusY = Math.abs((y2 - y1) / 2);
      const averageRadius = (radiusX + radiusY) / 2;
      const distanceToCenter = distance(center, { x, y });
      const insideEllipse = Math.pow(x - x1, 2) / Math.pow(radiusX, 2) + Math.pow(y - y1, 2) / Math.pow(radiusY, 2) <= 1;
      return distanceToCenter <= averageRadius || insideEllipse ? 'inside' : null;
    case 'pencil':
      const betweenAnyPoint = element.points.some((point, index) => {
        const nextPoint = element.points[index + 1] as unknown as IPoint;
        if (!nextPoint) return false;
        return onLine(point.x, point.y, nextPoint.x, nextPoint.y, x, y, 5) != null;
      });
      return betweenAnyPoint ? 'inside' : null;
    case 'arrow':
    case 'diamond':
    case 'text':
    case 'image':
      return x >= x1 && x <= x2 && y >= y1 && y <= y2 ? 'inside' : null;
    default:
      throw new Error(`Type not recognized: ${type}`);
  }
}

function hexToRgb(hex: string) {
  // group hex string into 3 groups (r, g, b) and parse them to integers
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

function convertedColor(option: string, opacity: number) {
  return `rgba(${hexToRgb(option).r}, ${hexToRgb(option).g}, ${hexToRgb(option).b}, ${opacity})`;
}

function nearPoint(x: number, y: number, x1: number, y1: number, name: string) {
  return Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5 ? name : null;
}

export const cursorForPosition = (position: string | boolean | null) => {
  switch (position) {
    case 'tl':
    case 'br':
    case 'start':
    case 'end':
    case 'left':
    case 'right':
      return 'nwse-resize';
    case 'tr':
    case 'bl':
    case 'top':
    case 'bottom':
      return 'nesw-resize';
    default:
      return 'move';
  }
};

export const resizedCoordinates = (
  clientX: number,
  clientY: number,
  position: string | undefined,
  coordinates: { x1: number; y1: number; x2: number; y2: number }
) => {
  const { x1, y1, x2, y2 } = coordinates;
  switch (position) {
    case 'tl':
    case 'start':
      return { x1: clientX, y1: clientY, x2, y2 };
    case 'tr':
      return { x1, y1: clientY, x2: clientX, y2 };
    case 'bl':
      return { x1: clientX, y1, x2, y2: clientY };
    case 'br':
    case 'end':
      return { x1, y1, x2: clientX, y2: clientY };
    case 'top':
      return { x1, y1: clientY, x2, y2 };
    case 'bottom':
      return { x1, y1, x2, y2: clientY };
    case 'left':
      return { x1: clientX, y1, x2, y2 };
    case 'right':
      return { x1, y1, x2: clientX, y2 };
    default:
      return { x1, y1, x2, y2 };
  }
};
