/*
    Export who is following me
    by: Alex Ayers

    This will export a list of your followers
*/

// Base API Path
const sunoAPI = "https://studio-api.suno.ai/api";

// Dynamically load JSZip library
const loadJSZip = () => {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
        script.type = "text/javascript";
        script.onload = () => {
            console.log('JSZip loaded successfully');
            resolve();
        };
        script.onerror = () => reject(new Error('Failed to load JSZip'));
        document.head.appendChild(script);
    });
};

// Find Bearer token
function getCookieValue(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}


async function getAllFollowers() {
    const zip = new JSZip();
    const sunoFolder = zip.folder('suno');

    let allFollowers = [];
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    let totalPages = await howManyPages();

    console.log('Processing followers...');

    for (let i = 0; i < totalPages; i++) {

        let bearerToken = getCookieValue('__session');
        let response = await fetch(`${sunoAPI}/profiles/followers?page=${i + 1}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${bearerToken}`,
                'Content-Type': 'application/json',
            },

        });

        let data = await response.json();

        for (let j = 0; j < data.profiles.length; j++) {
            let follower = {
                id: data.profiles[j]['external_user_id'],
                handle: data.profiles[j]['handle'],
                followers_count: data.profiles[j]['stats']['followers_count'],
            }

            allFollowers.push(follower);
        }


        console.log(`Processed page ${i + 1} of ${totalPages}`);
        await delay(120); // Add delay to avoid overwhelming the API

    }

    // Add metadata JSON to the ZIP archive
    const json = JSON.stringify(allFollowers, null, 2);
    sunoFolder.file('followers.json', json);

    zip.generateAsync({ type: "blob" }).then((zipBlob) => {
        const zipUrl = URL.createObjectURL(zipBlob);
        const a = document.createElement('a');
        a.href = zipUrl;
        a.download = 'suno_follower.zip';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(zipUrl);
        console.log('ZIP file downloaded as suno_follower.zip');
    });

    return allFollowers;
}


async function howManyPages() {

    let bearerToken = getCookieValue('__session');
    // Get total pages required

    let response = await fetch(`${sunoAPI}/profiles/followers?page=1`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'Content-Type': 'application/json',
        },

    });

    let data = await response.json();
    return Math.ceil(data.num_total_profiles / 20);
}

// Backup followers
async function backupFollowers() {
    await loadJSZip(); // Ensure JSZip is loaded
    await getAllFollowers();
}

// Execute backup
await backupFollowers();
