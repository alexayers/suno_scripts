/*
    This library allows you to perform useful actions once authenticated with Suno.
    Author: Alex Ayers
*/

// Find Bearer token
function getCookieValue(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

// Find total items in trash
async function getTotalTrashSize() {
  let bearerToken = getCookieValue('__session');
  await fetch('https://studio-api.suno.ai/api/clips/trashed_v2?page=0&page_size=1', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ' + bearerToken,
    'Content-Type': 'application/json'
  }
})
  .then(res => res.json())
  .then(data => {
    size = data.num_total_results;
  })
  .catch(error => {
    console.error('Error:', error);
  });
 
  return size;
}

// Search trash for a given song
async function searchTrash(search) {
  let bearerToken = getCookieValue('__session');
  let tashSize = await getTotalTrashSize();
  let searchResults;
  await fetch('https://studio-api.suno.ai/api/clips/trashed_v2?page=0&page_size=' + tashSize, {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ' + bearerToken,
    'Content-Type': 'application/json'
  }
})
  .then(res => res.json())
  .then(data => {
 
    /*
      Perform a search against title for each song returned. Calculate the page by dividing the index by the default
      total page size 20.
    */
    searchResults = data.clips
        .map((e, index) => ({ title: e.title, page: Math.round(index/20), id: e.id }))
        .filter(e => e.title.includes(search));

    console.log(searchResults);    
  })
  .catch(error => {
    console.error('Error:', error);
  });
 
  return searchResults;
}
 
