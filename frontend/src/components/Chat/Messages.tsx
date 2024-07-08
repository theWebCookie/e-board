import { IMessage } from './Chat';
import Message from './Message';

interface IMessagesProps {
  messages: IMessage[];
  currentClientId: string | null;
}

const Messages: React.FC<IMessagesProps> = ({ messages, currentClientId }) => {
  return (
    <ul>
      {messages.map((msg, index) => (
        <Message key={index} message={msg.message} isRight={msg.clientId === currentClientId} />
      ))}
    </ul>
  );
};

export default Messages;
