import getStroke from 'perfect-freehand';
import rough from 'roughjs';
import { RoughCanvas } from 'roughjs/bin/canvas';
import { Drawable } from 'roughjs/bin/core';
import { Point } from 'roughjs/bin/geometry';
import { IOptions } from './page';

export interface IElement {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  roughElement: Drawable;
  type: string;
  points: Point[];
  id: number;
}

export interface IEvent {
  clientX: number;
  clientY: number;
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
}

const pencilStrokeOptions = { size: 3, thinning: 0.7, simulatePressure: true };

const hexToRgb = (hex: string) => {
  // group hex string into 3 groups (r, g, b) and parse them to integers
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
};

const convertedColor = (option: string, opacity: number) => {
  return `rgba(${hexToRgb(option).r}, ${hexToRgb(option).g}, ${hexToRgb(option).b}, ${opacity})`;
};

const formatOptions = (options: IOptions): INewOptions => ({
  bowing: 2,
  fillStyle: 'solid',
  roughness: parseFloat(options.roughness),
  seed: options.seed,
  fill: options.fill === 'transparent' ? 'rgba(0,0,0,0)' : convertedColor(options.fill, parseFloat(options.opacity)),
  stroke: convertedColor(options.stroke, parseFloat(options.opacity)),
  strokeWidth: parseInt(options.strokeWidth),
  strokeLineDash: options.strokeLineDash === '' ? [] : options.strokeLineDash.split(',').map((x) => parseInt(x)),
});

export const createElement = (id: number, x1: number, y1: number, x2: number, y2: number, type: string, options: IOptions) => {
  const newOptions = formatOptions(options);
  switch (type) {
    case 'line':
      return { id, type, x1, y1, x2, y2, roughElement: generator.line(x1, y1, x2, y2, newOptions) };
    case 'rectangle':
      return { id, type, x1, y1, x2, y2, roughElement: generator.rectangle(x1, y1, x2 - x1, y2 - y1, newOptions) };
    case 'circle':
      return { id, type, x1, y1, x2, y2, roughElement: generator.circle(x1, y1, x2 - x1, newOptions) };
    case 'diamond':
      const points = [
        [x1, y1 + (y2 - y1) / 2],
        [x1 + (x2 - x1) / 2, y1],
        [x2, y1 + (y2 - y1) / 2],
        [x1 + (x2 - x1) / 2, y2],
      ];
      return { id, type, x1, y1, x2, y2, roughElement: generator.polygon(points as Point[], newOptions) };
    case 'pencil':
      return { id, type, points: [{ x: x1, y: y1 }] };
    case 'arrow':
      return { id, type, x1, y1, x2, y2 };
    default:
      throw new Error(`Type not recognized: ${type}`);
  }
};

export const getSvgPathFromStroke = (stroke: any[]) => {
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
      context.fill(new Path2D(stroke));
      break;
    case 'arrow':
      const headLength = 10;
      const startX = element.x1;
      const startY = element.y1;
      const endX = element.x2;
      const endY = element.y2;
      const angle = Math.atan2(endY - startY, endX - startX);

      roughCanvas.line(startX, startY, endX, endY);
      roughCanvas.line(endX, endY, endX - headLength * Math.cos(angle - Math.PI / 6), endY - headLength * Math.sin(angle - Math.PI / 6), {
        stroke: 'black',
        strokeWidth: 2,
      });
      roughCanvas.line(endX, endY, endX - headLength * Math.cos(angle + Math.PI / 6), endY - headLength * Math.sin(angle + Math.PI / 6), {
        stroke: 'black',
        strokeWidth: 2,
      });
      break;
    default:
      throw new Error(`Type not recognized: ${element.type}`);
  }
};

export const getMouseCoordinates = (event: { clientX: number; clientY: number }) => {
  const clientX = event.clientX;
  const clientY = event.clientY;
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
