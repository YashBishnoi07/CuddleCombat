import axios from 'axios';

axios.get('https://api.themoviedb.org/3/watch/providers/movie?api_key=e547e17d4e91f3e62a571655cd1ccaff&watch_region=IN')
  .then(res => {
    const providers = res.data.results;
    const targetNames = ['Sony Liv', 'Hotstar', 'Jio Cinema', 'Zee5', 'Netflix', 'Amazon Prime Video'];
    providers.forEach(p => {
      if (p.provider_name.toLowerCase().includes('sony') || 
          p.provider_name.toLowerCase().includes('hotstar') || 
          p.provider_name.toLowerCase().includes('jio') || 
          p.provider_name.toLowerCase().includes('zee5') ||
          p.provider_name.toLowerCase().includes('netflix') ||
          p.provider_name.toLowerCase().includes('amazon prime')) {
        console.log(p.provider_name, p.provider_id);
      }
    });
  })
  .catch(console.error);
