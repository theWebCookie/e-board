import { IOptions } from '@/app/board/[id]/page';
import ToolMenuItem from './ToolMenuItem';
import { useState } from 'react';

interface ToolMenuProps {
  className: string;
  options: IOptions;
  setOptions: (options: IOptions) => void;
  selectedTool: string;
}

const ToolMenu: React.FC<ToolMenuProps> = ({ className, options, setOptions, selectedTool }) => {
  const [activeTools, setActiveTools] = useState({
    stroke: 'stroke-0',
    fill: 'fill-0',
    strokeWidth: 'strokeWidth-0',
    strokeLineDash: 'strokeLineDash-0',
    roughness: 'roughness-0',
  });

  const items = [
    {
      text: selectedTool === 'arrow' || selectedTool === 'line' || selectedTool === 'pencil' || selectedTool === 'text' ? 'Kolor' : 'Obramowanie',
      colors: ['#000000', '#ff0000', '#00ff00', '#0000ff'],
      name: 'stroke',
    },
    { text: 'Tło', colors: ['transparent', '#ff0000', '#00ff00', '#0000ff'], name: 'fill' },
    { text: 'Przeźroczystość', name: 'opacity', value: 1 },
    {
      text: 'Szerokość obramowania',
      buttons: [
        { image: '/line_0.svg', value: '1' },
        { image: '/line_1.svg', value: '2' },
        { image: '/line_2.svg', value: '3' },
      ],
      name: 'strokeWidth',
    },
    {
      text: 'Styl obramowania',
      buttons: [
        { image: '/stroke_0.svg', value: '' },
        { image: '/stroke_1.svg', value: '10, 5' },
        { image: '/stroke_2.svg', value: '2, 2' },
      ],
      name: 'strokeLineDash',
    },
    {
      text: 'Styl elementu',
      buttons: [
        { image: '/sloppiness_0.svg', value: '0' },
        { image: '/sloppiness_1.svg', value: '1.2' },
        { image: '/sloppiness_2.svg', value: '2.4 ' },
      ],
      name: 'roughness',
    },
  ];

  const filteredItems = items.filter((item) => {
    if (selectedTool === 'arrow' || selectedTool === 'pencil') {
      return item.name === 'stroke' || item.name === 'opacity';
    } else if (selectedTool === 'text') {
      return item.name === 'stroke' || item.name === 'fontSize';
    } else if (selectedTool === 'line') {
      return item.name !== 'fill';
    } else if (selectedTool === 'image' || selectedTool === 'eraser') {
      return false;
    }
    return true;
  });

  return (
    <div className={`p-3 rounded-md bg-white ${className}`}>
      <ul>
        {filteredItems.map((item, idx) => (
          <ToolMenuItem
            key={idx}
            text={item.text}
            buttons={item.buttons}
            colors={item.colors}
            name={item.name}
            opacity={item.value}
            options={options}
            setOptions={setOptions}
            activeTools={activeTools}
            setActiveTools={setActiveTools}
          />
        ))}
      </ul>
    </div>
  );
};

export default ToolMenu;
