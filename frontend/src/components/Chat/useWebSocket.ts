import { useEffect, useRef, useState } from 'react';

interface WebSocketOptions {
  onOpen?: () => void;
  onClose?: () => void;
  onMessage?: (data: any) => void;
}

export function useWebSocket(url: string, options?: WebSocketOptions) {
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket(url);

    socket.binaryType = 'blob';

    socket.addEventListener('open', () => {
      console.log('WebSocket connection opened');
      if (options?.onOpen) options.onOpen();
    });

    socket.addEventListener('close', () => {
      console.log('WebSocket connection closed');
      if (options?.onClose) options.onClose();
    });

    socket.addEventListener('message', (message: MessageEvent) => {
      if (options?.onMessage) options.onMessage(JSON.parse(message.data));
    });

    setWs(socket);

    return () => {
      socket.close();
    };
  }, [url]);

  return ws;
}
