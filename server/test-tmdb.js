import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import { getMovies } from './services/tmdb.js';

getMovies({ page: 1 })
  .then(res => console.log('SUCCESS:', res.results?.length))
  .catch(err => console.error('ERROR:', err.message, err.response?.data));
