import Image from 'next/image';
import './BoardButton.css';

interface ArrowProps extends React.HTMLProps<HTMLButtonElement> {
  className: string;
  path: string;
  alt: string;
}

const BoardButton: React.FC<ArrowProps> = ({ className, path, alt }) => {
  return (
    <button className={`board-button ${className}`} type='button'>
      <Image src={path} alt={alt} width={20} height={20} />
    </button>
  );
};

export default BoardButton;
