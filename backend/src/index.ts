import { Server } from 'http';
import ws, { WebSocketServer } from 'ws';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import config from 'config';
import { IAppConfig } from './app';
import { handleBoardContentSaveDebounced } from './controllers/board';
import { handleMessagesSave } from './controllers/message';
import { handleNotificationSave } from './controllers/notification';

const appConfig = config.get<IAppConfig>('app');

const rooms: { [key: string]: ws.WebSocket[] } = {};
let canvasImage: string | null = null;
const boardContentCache: { [boardId: string]: any } = {};

export const clientUserMap: Map<ws.WebSocket, string> = new Map();

export function setupWebSocketServer(server: Server) {
  const wss = new WebSocketServer({ server });

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

    client.on('message', async (msg: string) => {
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

        await handleBoardContentSaveDebounced(messageData, messageData.roomId);

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

        await handleMessagesSave(messageData.message.message, roomId, clientId);

        if (roomId) {
          broadcastToRoom(roomId, JSON.stringify(messageData));
        } else {
          console.log('Error: No room ID provided for message broadcast.');
        }
      }

      if (messageData.type === 'notification') {
        const roomId = messageData.roomId;

        console.log(messageData);

        await handleNotificationSave(messageData.title, clientId, messageData.recieverId, roomId);

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

  async function broadcastToRoom(roomId: string, msg: string, sender?: ws.WebSocket) {
    for (const client of wss.clients) {
      if (client.readyState === ws.OPEN && client !== sender) {
        try {
          client.send(msg);
        } catch (error) {
          console.error('Error broadcasting to client:', error);
        }
      }
    }
  }
}
