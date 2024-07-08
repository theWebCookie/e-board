import { createServer } from 'http';
import staticHandler from 'serve-handler';
import ws, { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';

const server = createServer((req, res) => {
  return staticHandler(req, res, { public: 'public' });
});

const wss = new WebSocketServer({ server });

wss.on('connection', (client) => {
  const clientId = uuidv4();
  client.send(JSON.stringify({ type: 'client-id', clientId }));

  console.log(`Client connected, id: ${clientId}`);

  client.on('message', (msg: string) => {
    console.log(`Message: ${msg}`);
    const messageData = JSON.parse(msg);
    messageData.clientId = clientId;
    broadcast(JSON.stringify(messageData));
  });
});

function broadcast(msg: string) {
  for (const client of wss.clients) {
    if (client.readyState === ws.OPEN) {
      client.send(msg);
    }
  }
}
server.listen(process.argv[2] || 8080, () => {
  console.log(`server listening...`);
});
