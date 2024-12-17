/*
    YUCK! TAKE OUT THE TRASH

    This script will empty your trash
    Author: Alex Ayers
*/

const sunoAPI = "https://studio-api.suno.ai/api";
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Find Bearer token
function getCookieValue(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

async function getPersonaClips() {

    let bearerToken = getCookieValue('__session');
    let personaClipIds = [];

    try {
        const res = await fetch(`${sunoAPI}/persona/get-personas`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + bearerToken,
                'Content-Type': 'application/json'
            }
        });

        const data = await res.json();
        personaClipIds = data.personas.map((clip) => clip.root_clip_id);

    } catch (error) {
        console.error('Error:', error);
    }

    return personaClipIds;
}

async function emptyTrash(batchSize) {
    let bearerToken = getCookieValue('__session');
    let deletingSongs = true;
    let personaClipIds = await getPersonaClips();

    console.log(personaClipIds);

    do {

        try {
            const res = await fetch(`${sunoAPI}/clips/trashed_v2?page=0&page_size=${batchSize}`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + bearerToken,
                    'Content-Type': 'application/json'
                }
            });

            const data = await res.json();

            if (data.clips && data.clips.length > 0) {

                await fetch(`${sunoAPI}/clips/delete`, {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + bearerToken,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        'ids': data.clips
                            // This shouldn't needed but this ensure we are deleting things that are 100% in the trash
                            .filter((clip) => clip.is_trashed === true)
                            // Exclude persona clips
                            .filter((clip) => !personaClipIds.includes(clip.id))
                            .map((clip) => clip.id)
                    })
                });

                console.log(`Deleted ${batchSize} songs`);
                await delay(250); // Add delay to avoid overwhelming the API
            } else {
                console.log('No more songs to delete');
                deletingSongs = false;
            }
        } catch (error) {
            console.error('Error:', error);
        }
    } while (deletingSongs);
}

(async () => {
    await emptyTrash(20);
    console.log('Deleted songs');
})();
