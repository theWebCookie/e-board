import { IOptions, useBoard } from '@/app/board/[id]/page';
import ToolMenuItem from './ToolMenuItem';
import { useState } from 'react';

interface ToolMenuProps {
  className: string;
}

const ToolMenu: React.FC<ToolMenuProps> = ({ className }) => {
  const { tool } = useBoard();
  const [activeTools, setActiveTools] = useState({
    stroke: 'stroke-0',
    fill: 'fill-0',
    strokeWidth: 'strokeWidth-0',
    strokeLineDash: 'strokeLineDash-0',
    roughness: 'roughness-0',
    fontSize: 'fontSize-0',
  });

  console.log('tool:', tool);

  const items = [
    {
      text: tool === 'arrow' || tool === 'line' || tool === 'pencil' || tool === 'text' ? 'Kolor' : 'Obramowanie',
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
    ...(tool === 'text'
      ? [
          {
            text: 'Rozmiar czcionki',
            buttons: [
              { image: '/font_size.svg', value: '20' },
              { image: '/font_size.svg', value: '24' },
              { image: '/font_size.svg', value: '28' },
            ],
            name: 'fontSize',
          },
        ]
      : []),
  ];

  const filteredItems = items.filter((item) => {
    if (tool === 'arrow' || tool === 'pencil') {
      return item.name === 'stroke';
    } else if (tool === 'text') {
      return item.name === 'stroke' || item.name === 'fontSize';
    } else if (tool === 'line') {
      return item.name !== 'fill';
    } else if (tool === 'image' || tool === 'eraser') {
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
            activeTools={activeTools}
            setActiveTools={setActiveTools}
          />
        ))}
      </ul>
    </div>
  );
};

export default ToolMenu;
