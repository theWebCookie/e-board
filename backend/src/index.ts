import { createServer } from 'http';
import staticHandler from 'serve-handler';
import ws, { WebSocketServer } from 'ws';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import config from 'config';
import { IAppConfig } from './app';
import { handleBoardContentSave, handleBoardContentSaveDebounced } from './controllers/board';
import { handleMessagesSave } from './controllers/message';

const server = createServer((req, res) => {
  return staticHandler(req, res, { public: 'public' });
});

const appConfig = config.get<IAppConfig>('app');

export const wss = new WebSocketServer({ server });

const rooms: { [key: string]: ws.WebSocket[] } = {};
let canvasImage: string | null = null;
const boardContentCache: { [boardId: string]: any } = {};

export const clientUserMap: Map<ws.WebSocket, string> = new Map();

wss.on('connection', (client, req) => {
  const cookies = cookie.parse(req.headers.cookie || '');
  const token = cookies.token;

  if (!token) {
    console.error('No token found in cookies, closing connection.');
    client.close();
    return;
  }

  const decoded: any = jwt.verify(token, appConfig.jwtSecret);
  const clientId = decoded.id;
  clientUserMap.set(client, clientId);

  let currentRoom: string | null = null;

  client.send(JSON.stringify({ type: 'client-id', clientId }));
  console.log(`Client connected, id: ${clientId}`);

  client.on('message', (msg: string) => {
    const messageData = JSON.parse(msg);
    messageData.clientId = clientId;

    if (messageData.type === 'join-room') {
      currentRoom = messageData.roomId;

      if (!currentRoom) {
        console.log('Error: Room ID is null');
        return;
      }

      if (!rooms[currentRoom]) {
        rooms[currentRoom] = [];
        console.log(`Room ${currentRoom} created.`);
      }

      if (!rooms[currentRoom].includes(client)) {
        rooms[currentRoom].push(client);
        console.log(`Client ${clientId} joined room: ${currentRoom}`);
      }
    }

    if (messageData.type === 'canvas') {
      canvasImage = messageData.data;
      messageData.data = canvasImage;

      handleBoardContentSaveDebounced(messageData, messageData.roomId);

      const roomId = messageData.roomId;

      boardContentCache[roomId] = messageData.data;

      if (roomId) {
        broadcastToRoom(roomId, JSON.stringify(messageData), client);
      } else {
        console.log('Error: No room ID provided for canvas broadcast.');
      }
    }

    if (messageData.type === 'message') {
      const roomId = messageData.roomId;

      handleMessagesSave(messageData.message.message, roomId, clientId);

      if (roomId) {
        broadcastToRoom(roomId, JSON.stringify(messageData));
      } else {
        console.log('Error: No room ID provided for message broadcast.');
      }
    }
  });

  client.on('close', () => {
    if (currentRoom) {
      rooms[currentRoom] = rooms[currentRoom].filter((c) => c !== client);
      console.log(`Client ${clientId} left room: ${currentRoom}`);
    }
    clientUserMap.delete(client);
  });
});

function broadcastToRoom(roomId: string, msg: string, sender?: ws.WebSocket) {
  for (const client of wss.clients) {
    if (client.readyState === ws.OPEN && client != sender) {
      console.log('Broadcasting to all clients', msg);
      client.send(msg);
    }
  }
}

server.listen(process.argv[2] || 8080, () => {
  console.log(`Server listening...`);
});
