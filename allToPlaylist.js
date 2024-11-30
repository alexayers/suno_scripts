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
    const bearerToken = getCookieValue('__session');
    if (!bearerToken) {
        console.error("Bearer token not found.");
        return false;
    }

    try {
        const response = await fetch(`${sunoAPI}/notification`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${bearerToken}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        const haters = data.notifications.filter(e =>
            e.notification_type.includes('unfollow') || e.notification_type.includes('clip_unlike')
        );

        console.log("Haters:", haters);
        return true; // Assuming the existence of the playlist is validated
    } catch (error) {
        console.error("Error checking for backup playlist:", error);
        return false;
    }
  }

   // Create our special backup playlist exists
   async function createBackupPlaylist() {
    const bearerToken = getCookieValue('__session');
    if (!bearerToken) {
        console.error("Bearer token not found.");
        return null;
    }

    try {
        const response = await fetch(`${sunoAPI}/playlist/create/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${bearerToken}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        const haters = data.notifications.filter(e =>
            e.notification_type.includes('unfollow') || e.notification_type.includes('clip_unlike')
        );

        console.log("Haters:", haters);
        return data; // Return created playlist data if needed
    } catch (error) {
        console.error("Error creating backup playlist:", error);
        return null;
    }
   }
  

  
  let answer= await doesBackupPlaylistExist();
  console.log(answer);