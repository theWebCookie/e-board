import Image from 'next/image';
import './Arrow.css';

interface ArrowProps extends React.HTMLProps<HTMLButtonElement> {
  className: string;
}

const Arrow: React.FC<ArrowProps> = ({ className }) => (
  <button className={className}>
    <Image src='/arrow-button.svg' alt='Arrow' width={20} height={20} />
  </button>
);

export default Arrow;
