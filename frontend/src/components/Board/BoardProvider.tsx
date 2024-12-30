'use client';
import { defaultOptions } from '@config';
import { ReactNode, useState, useEffect, useContext } from 'react';
import { createContext } from 'react';
import { IImageData, IOptions, ITool } from './Board';

interface IBoardContext {
  tool: string;
  tools: ITool[];
  setTool: (tool: string) => void;
  isHidden: boolean;
  setIsHidden: (x: boolean) => void;
  toggleVisibility: () => void;
  options: IOptions;
  setOptions: (options: IOptions) => void;
  isToolMenuOpen: boolean;
  imageData: IImageData;
  setImageData: (x: IImageData) => void;
}

const defaultBoardContextValue: IBoardContext = {
  tool: 'pointer',
  tools: [],
  setTool: () => {},
  isHidden: true,
  setIsHidden: () => {},
  toggleVisibility: () => {},
  options: { ...defaultOptions, seed: Math.floor(Math.random() * 2 ** 31) },
  setOptions: () => {},
  isToolMenuOpen: false,
  imageData: { width: 0, height: 0, data: '' },
  setImageData: () => {},
};

const BoardContext = createContext<IBoardContext>(defaultBoardContextValue);

export const BoardProvider = ({ children }: { children: ReactNode }) => {
  const [tool, setTool] = useState('pointer');
  const [isHidden, setIsHidden] = useState(true);
  const [options, setOptions] = useState<IOptions>({ ...defaultOptions, seed: null });
  const isToolMenuOpen = tool !== 'pointer' && tool !== 'eraser' && tool !== 'image';
  const [imageData, setImageData] = useState<IImageData>({ width: 0, height: 0, data: '' });

  useEffect(() => {
    setOptions((prevOptions) => ({ ...prevOptions, seed: Math.floor(Math.random() * 2 ** 31) }));
  }, [setOptions]);

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

  const toggleVisibility = () => {
    setIsHidden(!isHidden);
  };

  const value = {
    tool,
    tools,
    setTool,
    isHidden,
    setIsHidden,
    toggleVisibility,
    options,
    setOptions,
    isToolMenuOpen,
    imageData,
    setImageData,
  };

  return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>;
};

export const useBoard = () => {
  return useContext(BoardContext);
};
