import axios from 'axios';
import https from 'https';
import freekeys from 'freekeys';

const MOCK_MOVIES = [
  { id: 101, title: 'Inception', poster_path: '/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg', release_date: '2010-07-15', vote_average: 8.8, overview: 'A thief who steals corporate secrets through the use of dream-sharing technology...', media_type: 'movie' },
  { id: 102, title: 'The Dark Knight', poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg', release_date: '2008-07-16', vote_average: 9.0, overview: 'Batman raises the stakes in his war on crime.', media_type: 'movie' },
  { id: 103, title: 'Interstellar', poster_path: '/gEU2QlsUUHXjNpeVDcrcwfHkX1j.jpg', release_date: '2014-11-05', vote_average: 8.6, overview: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.', media_type: 'movie' },
  { id: 104, title: 'Parasite', poster_path: '/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg', release_date: '2019-05-30', vote_average: 8.5, overview: 'All unemployed, Ki-taek\'s family takes peculiar interest in the wealthy and glamorous Parks...', media_type: 'movie' },
  { id: 105, title: 'Dune', poster_path: '/d5NXSklXo0qyIYkgV94XAgMIckC.jpg', release_date: '2021-09-15', vote_average: 7.9, overview: 'Paul Atreides, a brilliant and gifted young man born into a great destiny beyond his understanding...', media_type: 'movie' },
  { id: 106, title: 'Spider-Man: No Way Home', poster_path: '/1g0dhYtq4irTY1R80vFAe85k0qJ.jpg', release_date: '2021-12-15', vote_average: 8.0, overview: 'Peter Parker is unmasked and no longer able to separate his normal life from the high-stakes of being a super-hero.', media_type: 'movie' }
];

export const getMovies = async ({ services, genres, page = 1 }) => {
  let apiKey = process.env.TMDB_API_KEY;
  
  try {
    const keys = await freekeys();
    if (keys && keys.tmdb_key) {
      apiKey = keys.tmdb_key;
    }
  } catch (err) {
    console.error('Failed to get dynamic key from freekeys:', err.message);
  }

  if (!apiKey) {
    console.warn('TMDB_API_KEY missing, using mock data.');
    return { results: MOCK_MOVIES };
  }

  const movieUrl = `https://api.tmdb.org/3/discover/movie`;
  const tvUrl = `https://api.tmdb.org/3/discover/tv`;
  
  const params = {
    api_key: apiKey,
    language: 'en-US',
    sort_by: 'popularity.desc',
    include_adult: false,
    include_video: false,
    page: page,
  };

  if (services) {
    const providerMap = {
      'netflix': 8,
      'prime video': 119,
      'disney+ hotstar': 122,
      'sonyliv': 237,
      'jiocinema': 220,
      'zee5': 232,
      'prime': 119,
      'disney+': 337,
      'hbo max': 384,
      'hulu': 15,
      'apple tv+': 350,
      'crunchyroll': 283,
      'max': 384
    };
    const providerIds = services.split(',').map(s => providerMap[s.trim().toLowerCase()]).filter(Boolean).join('|');
    if (providerIds) {
      params.with_watch_providers = providerIds;
      params.watch_region = 'IN';
    }
  }

  if (genres) {
    const genreMap = {
      'action': 28,
      'comedy': 35,
      'horror': 27,
      'romance': 10749,
      'sci-fi': 878,
      'drama': 18
    };
    const genreIds = genres.split(',').map(g => genreMap[g.trim().toLowerCase()]).filter(Boolean).join('|');
    if (genreIds) {
      params.with_genres = genreIds;
    }
  }

  try {
    const httpsAgent = new https.Agent({ family: 4 });
    

    const [movieRes, tvRes] = await Promise.allSettled([
      axios.get(movieUrl, { params, timeout: 5000, httpsAgent }),
      axios.get(tvUrl, { params, timeout: 5000, httpsAgent })
    ]);

    let combinedResults = [];

    if (movieRes.status === 'fulfilled' && movieRes.value.data.results) {
      const movies = movieRes.value.data.results.map(m => ({ ...m, media_type: 'movie' }));
      combinedResults = [...combinedResults, ...movies];
    }

    if (tvRes.status === 'fulfilled' && tvRes.value.data.results) {
      const tvShows = tvRes.value.data.results.map(tv => ({
        ...tv,
        title: tv.name,
        release_date: tv.first_air_date,
        media_type: 'tv'
      }));
      combinedResults = [...combinedResults, ...tvShows];
    }
    

    combinedResults.sort(() => Math.random() - 0.5);

    if (combinedResults.length > 0) {
       return { results: combinedResults };
    } else {
       if (Number(page) === 1) {
         console.warn('TMDB returned empty results on page 1, using mock data.');
         return { results: MOCK_MOVIES };
       } else {

         return { results: [] };
       }
    }
  } catch (error) {
    console.error('TMDB API Error:', error.message);
    if (Number(page) === 1) {
      console.warn('Falling back to mock data for page 1.');
      return { results: MOCK_MOVIES };
    }
    return { results: [] };
  }
};

export const getMovieDetails = async (id, type = 'movie') => {
  let apiKey = process.env.TMDB_API_KEY;
  
  try {
    const keys = await freekeys();
    if (keys && keys.tmdb_key) {
      apiKey = keys.tmdb_key;
    }
  } catch (err) {
    console.error('Failed to get dynamic key from freekeys:', err.message);
  }

  if (!apiKey) return null;

  try {
    const httpsAgent = new https.Agent({ family: 4 });
    const url = `https://api.tmdb.org/3/${type}/${id}`;
    const res = await axios.get(url, {
      params: {
        api_key: apiKey,
        append_to_response: 'videos,credits,watch/providers'
      },
      timeout: 5000,
      httpsAgent
    });
    return res.data;
  } catch (err) {
    console.error(`Failed to fetch details for ${type} ${id}:`, err.message);
    return null;
  }
};
