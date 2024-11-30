/*
  SHOW ME THE HATERS
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
  await fetch('https://studio-api.suno.ai/api/notification', {
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