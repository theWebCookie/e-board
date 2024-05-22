import Image from 'next/image';
import './Arrow.css';

interface ArrowProps extends React.HTMLProps<HTMLButtonElement> {
  direction: string;
}

const Arrow: React.FC<ArrowProps> = ({ direction }) => (
  <button className={`arrow ${direction}`}>
    <Image src='/arrow-button.svg' alt='Arrow' width={20} height={20} />
  </button>
);

export default Arrow;
