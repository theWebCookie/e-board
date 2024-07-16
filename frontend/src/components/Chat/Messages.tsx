import { useEffect, useRef } from 'react';
import { IMessage } from './Chat';
import Message from './Message';

interface IMessagesProps {
  messages: IMessage[];
  currentClientId: string | null;
}

const Messages: React.FC<IMessagesProps> = ({ messages, currentClientId }) => {
  const scrollRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <ul>
      {messages.map((msg, index) => (
        <Message key={index} message={msg.message} isRight={msg.clientId === currentClientId} />
      ))}
      <li ref={scrollRef}></li>
    </ul>
  );
};

export default Messages;
