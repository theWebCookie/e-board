'use client';
import './ToolPicker.css';
import Tool from './Tool';
import { useEffect, useState } from 'react';

interface Tool {
  name: string;
  icon: string;
}

const ToolPicker = () => {
  const [activeTool, setActiveTool] = useState<string | null>(null);

  useEffect(() => {
    setActiveTool('Wskaźnik');
  }, []);

  const tools: Tool[] = [
    {
      name: 'Wskaźnik',
      icon: '/pointer.svg',
    },
    {
      name: 'Prostokąt',
      icon: '/rectangle.svg',
    },
    {
      name: 'Diament',
      icon: '/diamond.svg',
    },
    {
      name: 'Okrąg',
      icon: '/circle.svg',
    },
    {
      name: 'Strzałka',
      icon: '/arrow.svg',
    },
    {
      name: 'Linia',
      icon: '/line.svg',
    },
    {
      name: 'Rysuj',
      icon: '/marker.svg',
    },
    {
      name: 'Tekst',
      icon: '/text.svg',
    },
    {
      name: 'Obraz',
      icon: '/image.svg',
    },
    {
      name: 'Gumka',
      icon: '/eraser.svg',
    },
  ];

  const handleToolClick = (toolName: string) => {
    setActiveTool(toolName === activeTool ? null : toolName);
  };

  return (
    <div className='tool-picker'>
      {tools.map((tool, idx) => (
        <Tool key={idx} icon={tool.icon} name={tool.name} active={activeTool === tool.name} onToolClick={() => handleToolClick(tool.name)} />
      ))}
    </div>
  );
};

export default ToolPicker;
