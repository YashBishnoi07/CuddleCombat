async function testTMDBProxy() {
  console.log('Testing api.tmdb.org...');
  try {
    const url = 'https://api.tmdb.org/3/configuration?api_key=e547e17d4e91f3e62a571655cd1ccaff';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const startTime = Date.now();
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    console.log(`Success! Took ${Date.now() - startTime}ms. Status: ${res.status}`);
  } catch (err) {
    console.error(`Failed: ${err.message}`);
  }
}

testTMDBProxy();
