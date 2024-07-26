import ToolMenuItem from './ToolMenuItem';

interface ToolMenuProps {
  className: string;
}

const items = [
  { text: 'Obramowanie', colors: ['black', 'red', 'green', 'blue'], name: 'strokeColor' },
  { text: 'Tło', colors: ['transparent', 'red', 'green', 'blue'], name: 'fillColor' },
  {
    text: 'Szerokość obramowania',
    buttons: [{ image: '/line_0.svg' }, { image: '/line_1.svg' }, { image: '/line_2.svg' }],
    name: 'strokeWidth',
  },
  {
    text: 'Styl obramowania',
    buttons: [{ image: '/stroke_0.svg' }, { image: '/stroke_1.svg' }, { image: '/stroke_2.svg' }],
    name: 'strokeStyle',
  },
  {
    text: 'Styl elementu',
    buttons: [{ image: '/sloppiness_0.svg' }, { image: '/sloppiness_1.svg' }, { image: '/sloppiness_2.svg' }],
    name: 'elementStyle',
  },
  { text: 'Przeźroczystość', name: 'opacity', value: 1 },
];

const ToolMenu: React.FC<ToolMenuProps> = ({ className }) => {
  return (
    <div className={`p-3 rounded-md ${className}`}>
      <ul>
        {items.map((item, idx) => (
          <ToolMenuItem key={idx} text={item.text} buttons={item.buttons} colors={item.colors} name={item.name} opacity={item.value} />
        ))}
      </ul>
    </div>
  );
};

export default ToolMenu;
