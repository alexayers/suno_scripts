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

  async function getAllClips(filter) {

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
        

        if (filter.downloadMusic === false) {
            console.log('Not downloading music');
        }

        if (filter.downloadArt === false) {
            console.log('Not downloading art');
        }


        for (let j = 0; j < data.project_clips.length; j++) {
            let mp3 = data.project_clips[j].clip.audio_url;
            let songID = data.project_clips[j].clip.id;
            let songTitle = data.project_clips[j].clip.title;
            let songArt = data.project_clips[j].clip.image_url;

            if (filter.downloadMusic === true) {
                try {
                    let response = await fetch(mp3, { method: 'GET' });
                    let blob = await response.blob();
                    let url = URL.createObjectURL(blob);
                    let a = document.createElement('a');
                    a.href = url;
                    let fileName = `${songID}_${songTitle}.mp3`;
                    a.download = fileName;
                    document.body.appendChild(a);
                    a.click();
            
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
            
                    console.log(`Downloaded: ${fileName}`);
                } catch (error) {
                    console.error(`Failed to download file: ${mp3}`, error);
                }
            }

            if (filter.downloadArt === true) {
                try {
                    let response = await fetch(songArt, { method: 'GET' });
                    let blob = await response.blob();
                    let url = URL.createObjectURL(blob);
                    let a = document.createElement('a');
                    a.href = url;
                    let fileName = `${songID}_${songTitle}.jpeg`;
                    a.download = fileName;
                    document.body.appendChild(a);
                    a.click();
            
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
            
                    console.log(`Downloaded: ${fileName}`);
                } catch (error) {
                    console.error(`Failed to download file: ${songArt}`, error);
                }
            }

        }

        allClips.push(...data.project_clips); 
        console.log('working...');
        await delay(250);
    }

    return allClips;
  }

  async function backupSuno(filter) {
    let allClips = await getAllClips(filter);
   
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
  
await backupSuno({
    'downloadArt': false,
    'downloadMusic': false,
    'filters': {
        'public': true,
        'private': false,
        '':
    }
});
 
