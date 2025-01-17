import Image from 'next/image';
import { IMessage } from './Chat';

interface IMessageProps {
  message: IMessage;
  isRight?: boolean;
}

const Message: React.FC<IMessageProps> = ({ message, isRight = false }) => {
  const bubbleClasses = `p-4 text-blue-900 w-max max-w-full shadow-md flex items-start mb-8 ${
    isRight
      ? 'ml-auto rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl bg-white'
      : 'rounded-tl-2xl rounded-tr-2xl rounded-br-2xl rounded-bl-none bg-blue-300'
  }`;
  const avatarClasses = isRight ? 'w-9 h-9 rounded-full mr-4' : '';

  const date = new Date(message.sentAt);

  const formattedTime = date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  console.log(message);

  return (
    <>
      <div className={`font-light text-xs mb-1 ${isRight ? 'text-right' : 'text-left'}`}>
        <p>{message.name}</p>
      </div>
      <li className={bubbleClasses}>
        <Image src='/avatar.png' alt='Avatar' width={30} height={30} className={avatarClasses} />
        <div className='flex items-center ml-3'>
          <div className='max-w-[150px] break-words'>
            <div className='text-sm text-gray-900'>{message.message}</div>
            <div className='text-xs text-right mt-[2px]'>{formattedTime}</div>
          </div>
        </div>
      </li>
    </>
  );
};

export default Message;
