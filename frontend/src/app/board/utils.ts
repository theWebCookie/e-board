import getStroke from 'perfect-freehand';
import rough from 'roughjs';
import { RoughCanvas } from 'roughjs/bin/canvas';
import { Drawable } from 'roughjs/bin/core';
import { Point } from 'roughjs/bin/geometry';

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

export const createElement = (id: number, x1: number, y1: number, x2: number, y2: number, type: string) => {
  switch (type) {
    case 'line':
      return { id, type, x1, y1, x2, y2, roughElement: generator.line(x1, y1, x2, y2) };
    case 'rectangle':
      return { id, type, x1, y1, x2, y2, roughElement: generator.rectangle(x1, y1, x2 - x1, y2 - y1) };
    case 'circle':
      return { id, type, x1, y1, x2, y2, roughElement: generator.circle(x1, y1, x2 - x1) };
    case 'diamond':
      const points = [
        [x1, y1 + (y2 - y1) / 2],
        [x1 + (x2 - x1) / 2, y1],
        [x2, y1 + (y2 - y1) / 2],
        [x1 + (x2 - x1) / 2, y2],
      ];
      return { id, type, x1, y1, x2, y2, roughElement: generator.polygon(points as Point[]) };
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
      const stroke = getSvgPathFromStroke(getStroke(element.points));
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
