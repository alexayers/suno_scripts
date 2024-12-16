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
    return null;
  }

  let accountInfo = {};

  try {
    // Fetch session data
    const sessionResponse = await fetch(`${sunoAPI}/session`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!sessionResponse.ok) {
      throw new Error(`Failed to fetch session data. HTTP status: ${sessionResponse.status}`);
    }

    const sessionData = await sessionResponse.json();

    accountInfo = {
      id: sessionData["user"].id,
      username: sessionData["user"].username,
      email: sessionData["user"].email ? sessionData["user"].email.split('@')[0] + '@*****' : null,
      display_name: sessionData["user"].display_name ? sessionData["user"].display_name.split('@')[0] : null,
      are_you_subscribed: sessionData["roles"].sub,
    };

  } catch (error) {
    console.error("Error fetching session:", error);
    return null;
  }

  try {
    // Fetch creator info
    const id = accountInfo.id;
    const creatorInfoResponse = await fetch(`${sunoAPI}/user/get-creator-info/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!creatorInfoResponse.ok) {
      throw new Error(`Failed to fetch creator info. HTTP status: ${creatorInfoResponse.status}`);
    }

    const creatorData = await creatorInfoResponse.json();

    accountInfo.stats = creatorData.stats || null;

  } catch (error) {
    console.error("Error fetching creator info:", error);
  }

  return accountInfo;
}

(async () => {
  const accountInfo = await getMySession();
  if (accountInfo) {
    console.log(accountInfo);
  } else {
    console.error("Unable to retrieve account information.");
  }
})();