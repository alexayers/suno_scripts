/*
    Backup My Data.
    by: Alex Ayers

    This will grab your song meta data and provide you with a JSON file.
*/


// Base API Path
const sunoAPI = "https://studio-api.suno.ai/api";

// Find Bearer token
function getCookieValue(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  // How many pages do we need to search through to find our data?
  async function howManyPages() {
    let bearerToken = getCookieValue('__session');
    try {
        let response = await fetch(`${sunoAPI}/project/default?page=0`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + bearerToken,
                'Content-Type': 'application/json',
            },
        });
        let data = await response.json();
        let totalPages = Math.ceil(data.clip_count / 20);
        return totalPages; 
    } catch (error) {
        console.error('Error:', error);
        return 0; 
    }
}

  
  async function getAllClips() {

    let totalPages = await howManyPages();
    let allClips = [];

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


    for (let i = 0; i < totalPages; i++) {
        let bearerToken = getCookieValue('__session');
        
        let response = await fetch(`${sunoAPI}/project/default?page=${i}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${bearerToken}`,
                'Content-Type': 'application/json',
            },
        });

        let data = await response.json();
        allClips.push(...data.project_clips); 
        console.log('working...');
        await delay(250);
    }

    return allClips;
  }

  async function getMetaData() {
    let allClips = await getAllClips();
   
    const json = JSON.stringify(allClips, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backup.json';
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  
await getMetaData();
