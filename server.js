import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'public/views'));

app.use(express.static(join(__dirname, 'public')));

io.on('connection', (socket) => {
  let device;

  socket.on('deviceInfo', async (deviceInfo) => {
    device = deviceInfo;
  });

  socket.on('sendLocation', (coords) => {
    if (!device) {
      console.log('No device info available');
      return;
    }
    io.emit('receiveLocation', {
      id: socket.id,
      deviceInfo: device,
      ...coords
    });
  });

  socket.on('disconnect', () => {
    io.emit('userDisconnect', socket.id);
  });
});

app.get('/', (req, res) => {
  res.render('index');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});