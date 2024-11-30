/*
    All to Playlist
    by: Alex Ayers

    This will take all your Suno songs add them to specific playlist. 
*/


// Base API Path
const sunoAPI = "https://studio-api.suno.ai/api";

// The playlist ID for our special playlist.
let backUpPlistId = "";

// Find Bearer token
function getCookieValue(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
  
  // Check if our special backup playlist exists
  async function doesBackupPlaylistExist() {

  }

   // Create our special backup playlist exists
   async function createBackupPlaylist() {
    let bearerToken = getCookieValue('__session');

    await fetch(sunoAPI + '/playlist/create/', {
        method: 'POST',
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
  
  async function createBackUpPlaylist() {
    let bearerToken = getCookieValue('__session');
    await fetch(sunoAPI + '/notification', {
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
  
  await doesBackupPlaylistExist();