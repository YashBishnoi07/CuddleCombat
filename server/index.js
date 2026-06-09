import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { setupRoomHandlers } from './socket/roomHandler.js';
import { getMovies } from './services/tmdb.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const server = http.createServer(app);

app.use(cors({ origin: '*' })); // Allow all for prototype
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Centralized room state
// Structure: { roomId: { users: Set([socketId1, socketId2]), swipes: { socketId1: Set([movieId]), socketId2: Set([movieId]) } } }
const rooms = new Map();

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  setupRoomHandlers(io, socket, rooms);

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Proxy route for TMDB
app.get('/api/movies', async (req, res) => {
  try {
    const { services, genres, page } = req.query;
    const movies = await getMovies({ services, genres, page });
    res.json(movies);
  } catch (error) {
    console.error('Error fetching movies:', error.message);
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
