/*
    Backup My Data.
    by: Alex Ayers

    This will grab your song meta data and provide you with a JSON file.
*/


// Base API Path
const sunoAPI = "https://studio-api.suno.ai/api";

const script = document.createElement('script');
script.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
script.type = "text/javascript";
script.onload = () => console.log('JSZip loaded successfully');
document.head.appendChild(script);

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
    const zip = new JSZip();
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

            // Skip public songs if specified in filters
            if (data.project_clips[j].clip.is_public && filter.filters.includePublic === false) {
                continue;
            }

            // Skip private songs if specified in filters
            if (!data.project_clips[j].clip.is_public && filter.filters.includePrivate === false) {
                continue;
            }

            if (filter.downloadMusic === true) {
                try {
                    let response = await fetch(mp3, { method: 'GET' });
                    let blob = await response.blob();
                    let fileName = `${songID}_${songTitle}.mp3`;
                    
                    // Add music file to ZIP archive
                    zip.file(`music/${fileName}`, blob);
                    console.log(`Added to ZIP: ${fileName}`);
                } catch (error) {
                    console.error(`Failed to fetch music file: ${mp3}`, error);
                }
            }

            if (filter.downloadArt === true) {
                try {
                    let response = await fetch(songArt, { method: 'GET' });
                    let blob = await response.blob();
                    let fileName = `${songID}_${songTitle}.jpeg`;

                    // Add art file to ZIP archive
                    zip.file(`art/${fileName}`, blob);
                    console.log(`Added to ZIP: ${fileName}`);
                } catch (error) {
                    console.error(`Failed to fetch art file: ${songArt}`, error);
                }
            }
        }

        allClips.push(...data.project_clips);
        console.log('Working...');
        await delay(250);
    }

    // Generate and download the ZIP archive
    zip.generateAsync({ type: "blob" }).then((zipBlob) => {
        const zipUrl = URL.createObjectURL(zipBlob);
        const a = document.createElement('a');
        a.href = zipUrl;
        a.download = 'clips.zip'; // Name of the ZIP file
        document.body.appendChild(a);
        a.click();

        // Clean up
        document.body.removeChild(a);
        URL.revokeObjectURL(zipUrl);

        console.log('ZIP file downloaded as clips.zip');
    });

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
    'downloadArt': true,
    'downloadMusic': true,
    'filters': {
        'includePublic': true,
        'includePrivate': true
        
    }
});
 
