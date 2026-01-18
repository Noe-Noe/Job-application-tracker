// Background service worker
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'saveJobApplication') {
    handleSaveJobApplication(request.data)
      .then(result => sendResponse(result))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Keep the message channel open for async response
  }
});

async function handleSaveJobApplication(jobData) {
  try {
    // Get stored API endpoint and auth token
    const settings = await chrome.storage.local.get(['apiEndpoint', 'authToken']);
    
    if (!settings.apiEndpoint || !settings.authToken) {
      throw new Error('Please configure your Job Tracker settings in the extension popup');
    }

    // Send data to your backend API
    const response = await fetch(`${settings.apiEndpoint}/api/applications/from-extension`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${settings.authToken}`
      },
      body: JSON.stringify(jobData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to save application');
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error('Error saving job application:', error);
    return { success: false, error: error.message };
  }
}

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Open configuration page on first install
    chrome.tabs.create({
      url: 'popup.html'
    });
  }
});
