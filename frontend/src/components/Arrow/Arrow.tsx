import Image from 'next/image';
import './Arrow.css';

interface ArrowProps extends React.HTMLProps<HTMLButtonElement> {
  className: string;
  fn?: () => void;
}

const Arrow: React.FC<ArrowProps> = ({ className, fn }) => {
  const handleArrowClick = () => {
    if (fn) {
      fn();
    }
  };
  return (
    <button className={className} onClick={handleArrowClick} type='button'>
      <Image src='/arrow-button.svg' alt='Arrow' width={20} height={20} />
    </button>
  );
};

export default Arrow;
