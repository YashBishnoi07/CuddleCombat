import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { setupRoomHandlers } from './socket/roomHandler.js';
import { getMovies, getMovieDetails } from './services/tmdb.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const server = http.createServer(app);

app.use(cors({ origin: '*' }));
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});


const rooms = new Map();

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  setupRoomHandlers(io, socket, rooms);

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});


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

app.get('/api/movies/:id/details', async (req, res) => {
  try {
    const { type } = req.query; // 'movie' or 'tv'
    const details = await getMovieDetails(req.params.id, type || 'movie');
    if (!details) {
      return res.status(404).json({ error: 'Details not found' });
    }
    res.json(details);
  } catch (error) {
    console.error('Error fetching movie details:', error.message);
    res.status(500).json({ error: 'Failed to fetch movie details' });
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
