// Popup script for extension configuration
document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('settingsForm');
  const apiEndpointInput = document.getElementById('apiEndpoint');
  const authTokenInput = document.getElementById('authToken');
  const saveBtn = document.getElementById('saveBtn');
  const testBtn = document.getElementById('testBtn');
  const openAppBtn = document.getElementById('openAppBtn');
  const messageDiv = document.getElementById('message');
  const statusDiv = document.getElementById('status');
  const settingsLink = document.getElementById('settingsLink');

  // Load saved settings
  const settings = await chrome.storage.local.get(['apiEndpoint', 'authToken']);
  
  if (settings.apiEndpoint) {
    apiEndpointInput.value = settings.apiEndpoint;
    settingsLink.href = `${settings.apiEndpoint}/settings`;
  }
  
  if (settings.authToken) {
    authTokenInput.value = settings.authToken;
    updateStatus(true);
  }

  // Update settings link when API endpoint changes
  apiEndpointInput.addEventListener('input', () => {
    if (apiEndpointInput.value) {
      settingsLink.href = `${apiEndpointInput.value}/settings`;
    }
  });

  // Save configuration
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const apiEndpoint = apiEndpointInput.value.trim().replace(/\/$/, ''); // Remove trailing slash
    const authToken = authTokenInput.value.trim();

    if (!apiEndpoint || !authToken) {
      showMessage('Please fill in all fields', 'error');
      return;
    }

    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';

    try {
      // Save to storage
      await chrome.storage.local.set({
        apiEndpoint,
        authToken
      });

      showMessage('Configuration saved successfully!', 'success');
      updateStatus(true);
      
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save Configuration';

      // Test connection automatically after saving
      setTimeout(() => testConnection(), 500);
    } catch (error) {
      showMessage('Failed to save configuration', 'error');
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save Configuration';
    }
  });

  // Test connection
  testBtn.addEventListener('click', async () => {
    await testConnection();
  });

  async function testConnection() {
    const apiEndpoint = apiEndpointInput.value.trim().replace(/\/$/, '');
    const authToken = authTokenInput.value.trim();

    if (!apiEndpoint || !authToken) {
      showMessage('Please fill in all fields first', 'error');
      return;
    }

    testBtn.disabled = true;
    testBtn.textContent = 'Testing...';

    try {
      const response = await fetch(`${apiEndpoint}/api/test-connection`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        showMessage(`✓ Connected successfully! User: ${data.email || 'Unknown'}`, 'success');
        updateStatus(true);
      } else {
        showMessage('Connection failed. Please check your credentials.', 'error');
        updateStatus(false);
      }
    } catch (error) {
      showMessage('Connection failed. Please check your API endpoint.', 'error');
      updateStatus(false);
    } finally {
      testBtn.disabled = false;
      testBtn.textContent = 'Test Connection';
    }
  }

  // Open Job Tracker app
  openAppBtn.addEventListener('click', async () => {
    const settings = await chrome.storage.local.get(['apiEndpoint']);
    const url = settings.apiEndpoint || 'https://your-app.vercel.app';
    chrome.tabs.create({ url });
  });

  function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';

    setTimeout(() => {
      messageDiv.style.display = 'none';
    }, 5000);
  }

  function updateStatus(isConnected) {
    if (isConnected) {
      statusDiv.className = 'status connected';
      statusDiv.innerHTML = '<div class="status-dot"></div><span>Connected</span>';
    } else {
      statusDiv.className = 'status disconnected';
      statusDiv.innerHTML = '<div class="status-dot"></div><span>Not Connected</span>';
    }
  }
});
