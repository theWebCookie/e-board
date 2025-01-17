import { useEffect, useRef } from 'react';
import { IMessage } from './Chat';
import Message from './Message';

interface IMessagesProps {
  messages: IMessage[];
  currentClientId: string | null;
}

const Messages: React.FC<IMessagesProps> = ({ messages, currentClientId }) => {
  const scrollRef = useRef<HTMLLIElement>(null);

  const filteredMessages = messages.filter((msg, index, self) => {
    return (
      self.findIndex((m) => m.clientId === msg.clientId && m.message === msg.message && m.name === msg.name && m.sentAt === msg.sentAt) === index
    );
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [filteredMessages]);

  return (
    <ul>
      {filteredMessages.map((msg, index) => {
        //@ts-ignore
        const isRight = msg.clientId === currentClientId || msg.userId === currentClientId;

        return <Message key={index} message={msg} isRight={isRight} />;
      })}
      <li ref={scrollRef}></li>
    </ul>
  );
};

export default Messages;
