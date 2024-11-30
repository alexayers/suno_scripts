/*
  Add songs to playlist
  by: Alex Ayers
*/

// Find Bearer token
function getCookieValue(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
  
  // Who thinks I suck?
  async function showMeTheHaters() {
    let bearerToken = getCookieValue('__session');

    let page = 0;

    await fetch('https://studio-api.suno.ai/api/feed/v2?is_public=true&page=' + page, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + bearerToken,
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        haters = data.notifications
      .filter(e => e.notification_type.includes('unfollow') || e.notification_type.includes('clip_unlike'));
    
      console.log(haters);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  
  await showMeTheHaters();