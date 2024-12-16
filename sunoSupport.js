/*
  Pull my account info
  by: Alex Ayers
*/

// Base API Path
const sunoAPI = "https://studio-api.suno.ai/api";

// Find Bearer token
function getCookieValue(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

// Get your session data
async function getMySession() {
  const bearerToken = getCookieValue('__session');

  if (!bearerToken) {
    console.error("Bearer token not found. Please log in.");
    return;
  }

  try {
    const sessionResponse = await fetch(`${sunoAPI}/session`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!sessionResponse.ok) {
      throw new Error(`HTTP error! Status: ${sessionResponse.status}`);
    }

    const sessionData = await sessionResponse.json();

    let accountInfo = {
      id: sessionData["user"].id,
      username: sessionData["user"].username,
      email: sessionData["user"].email ? sessionData["user"].email.split('@')[0] + '@*****' : null,
      display_name: sessionData["user"].display_name ? sessionData["user"].display_name.split('@')[0] : null,
      are_you_subscribed: sessionData["roles"].sub,
    };

  } catch (error) {
    console.error("Error fetching session:", error);
  }

  try {

    const id = accountInfo['id'];
    const getCreatorInfo = await fetch(`${sunoAPI}/user/get-creator-info/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!getCreatorInfo.ok) {
      throw new Error(`HTTP error! Status: ${getCreatorInfo.status}`);
    }

    const creatorData = await getCreatorInfo.json();

    accountInfo = {
      stats: creatorData['stats']
    };



  } catch (error) {
    console.error("Error fetching get-creator-info:", error);
  }

  return accountInfo;
}

const accountInfo = await getMySession();

console.log(accountInfo);