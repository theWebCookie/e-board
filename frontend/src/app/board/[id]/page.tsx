'use client';
import { useState, useCallback, createContext, useContext, ReactNode, useEffect } from 'react';
import Arrow from '@/components/Arrow/Arrow';
import BoardButton from '@/components/BoardButton/BoardButton';
import ToolPicker from '@/components/ToolPicker/ToolPicker';
import Chat, { IMessage } from '@/components/Chat/Chat';
import { useRouter } from 'next/navigation';
import ToolMenu from '@/components/ToolMenu/ToolMenu';
import { defaultOptions } from '@config';
import Canvas from '@/components/Canvas/Canvas';
import { useWebSocket, WebSocketProvider } from '@/app/home/page';
import { IElement } from '../utils';

export interface ITool {
  name: string;
  icon: string;
  type: string;
}

export interface IOptions {
  roughness: string;
  seed: number | null;
  fill: string;
  stroke: string;
  strokeWidth: string;
  strokeLineDash: string;
  opacity: string;
  fontSize: string;
}

interface IBoardContext {
  tool: string;
  tools: ITool[];
  setTool: (tool: string) => void;
  isHidden: boolean;
  setIsHidden: (x: boolean) => void;
  toggleVisibility: () => void;
  options: IOptions;
  setOptions: (options: IOptions) => void;
  isToolMenuOpen: boolean;
  imageData: IImageData;
  setImageData: (x: IImageData) => void;
}

export interface IImageData {
  width: number;
  height: number;
  data: string;
}

interface IBoardPageProps {
  params: IBoardProps;
}
interface IBoardProps {
  id: string;
}

const defaultBoardContextValue: IBoardContext = {
  tool: 'pointer',
  tools: [],
  setTool: () => {},
  isHidden: true,
  setIsHidden: () => {},
  toggleVisibility: () => {},
  options: { ...defaultOptions, seed: Math.floor(Math.random() * 2 ** 31) },
  setOptions: () => {},
  isToolMenuOpen: false,
  imageData: { width: 0, height: 0, data: '' },
  setImageData: () => {},
};

const BoardContext = createContext<IBoardContext>(defaultBoardContextValue);

export const BoardProvider = ({ children }: { children: ReactNode }) => {
  const [tool, setTool] = useState('pointer');
  const [isHidden, setIsHidden] = useState(true);
  const [options, setOptions] = useState<IOptions>({ ...defaultOptions, seed: null });
  const isToolMenuOpen = tool !== 'pointer' && tool !== 'eraser' && tool !== 'image';
  const [imageData, setImageData] = useState<IImageData>({ width: 0, height: 0, data: '' });

  useEffect(() => {
    setOptions((prevOptions) => ({ ...prevOptions, seed: Math.floor(Math.random() * 2 ** 31) }));
  }, [setOptions]);

  const tools: ITool[] = [
    { name: 'Wskaźnik', icon: '/pointer.svg', type: 'pointer' },
    { name: 'Prostokąt', icon: '/rectangle.svg', type: 'rectangle' },
    { name: 'Diament', icon: '/diamond.svg', type: 'diamond' },
    { name: 'Okrąg', icon: '/circle.svg', type: 'circle' },
    { name: 'Strzałka', icon: '/arrow.svg', type: 'arrow' },
    { name: 'Linia', icon: '/line.svg', type: 'line' },
    { name: 'Rysuj', icon: '/marker.svg', type: 'pencil' },
    { name: 'Tekst', icon: '/text.svg', type: 'text' },
    { name: 'Obraz', icon: '/image.svg', type: 'image' },
    { name: 'Gumka', icon: '/eraser.svg', type: 'eraser' },
  ];

  const toggleVisibility = () => {
    setIsHidden(!isHidden);
  };

  const value = {
    tool,
    tools,
    setTool,
    isHidden,
    setIsHidden,
    toggleVisibility,
    options,
    setOptions,
    isToolMenuOpen,
    imageData,
    setImageData,
  };

  return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>;
};

export const useBoard = () => {
  return useContext(BoardContext);
};

const Board: React.FC<IBoardProps> = ({ id }) => {
  const { isHidden, isToolMenuOpen } = useBoard();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const router = useRouter();
  const handleGoBack = useCallback(() => router.back(), [router]);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [clientId, setClientId] = useState<string | null>(null);
  const { ws, sendMessage } = useWebSocket();
  const [receivedElements, setReceivedElements] = useState<IElement[]>([]);

  const handleChatOpen = () => {
    setIsChatOpen(!isChatOpen);
  };

  useEffect(() => {
    if (ws) {
      ws.onmessage = (message) => {
        const data = JSON.parse(message.data);
        console.log('Received WebSocket message:', data);

        if (data.type === 'canvas') {
          const newElements = JSON.parse(data.elements);
          // setReceivedElements((prevElements) => {
          //   return [...prevElements, ...newElements];
          // });
          setReceivedElements((prevElements) => {
            // Create a map that will store elements based on id and type
            const newElementsMap = new Map<string, IElement>();

            // Iterate over the current elements and add them to the map
            prevElements.forEach((el) => {
              const key = `${el.id}-${el.type}`; // Create a key combining id and type
              newElementsMap.set(key, el); // The map will automatically overwrite the previous element with the same id-type
            });

            // Iterate over the new elements and add them to the map
            newElements.forEach((el: IElement) => {
              const key = `${el.id}-${el.type}`; // Create a key combining id and type
              newElementsMap.set(key, el); // Add/overwrite based on the id-type
            });

            // Convert the map values back to an array and return it
            return Array.from(newElementsMap.values());
          });
        }
        if (data.type === 'client-id') {
          setClientId(data.clientId);
        }
        if (data.type === 'message') {
          console.log('Received message:', data.message);
          setMessages((prevMessages) => [...prevMessages, { message: data.message, clientId: data.clientId }]);
        }
      };
    }

    return () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [ws]);

  console.log(messages);

  return (
    <div className='w-full h-screen'>
      <Canvas ws={ws} sendMessage={sendMessage} receivedElements={receivedElements} roomId={id} clientId={clientId} />
      <div className='flex items-center justify-center absolute top-7 left-7 w-full'>
        <Arrow className='absolute left-2.5' fn={handleGoBack} />
        <ToolPicker className='flex justify-center flex-grow mx-auto' />
      </div>
      <Arrow
        className={`absolute right-0 bottom-1/2 translate-x-[-28px] translate-y-1/2 transition-transform ${
          isChatOpen ? 'translate-x-[-296px] rotate-180 z-10 bg-white size-12 rounded-full flex items-center justify-center' : ''
        }`}
        fn={handleChatOpen}
      />
      <Chat
        ws={ws}
        sendMessage={sendMessage}
        roomId={id}
        messages={messages}
        clientId={clientId}
        boardName='Mock Board'
        className={`absolute top-0 right-0 transition-transform ${isChatOpen ? 'translate-x-0' : 'translate-x-[20rem]'} ${isHidden ? 'hidden' : ''}`}
      />
      <ToolMenu className={`absolute top-1/3 left-7 border-2 rounded ${isToolMenuOpen ? '' : 'hidden'}`} />
      <BoardButton className='absolute bottom-7 left-7' alt='board-button' path='/board-button.svg' />
    </div>
  );
};

const BoardPage: React.FC<IBoardPageProps> = ({ params }) => {
  return (
    <WebSocketProvider>
      <BoardProvider>
        <Board id={params.id} />
      </BoardProvider>
    </WebSocketProvider>
  );
};

export default BoardPage;
