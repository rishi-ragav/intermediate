// Initialize storage
chrome.storage.local.get(['totalTime', 'websites', 'activeTab'], function(result) {
    if (!result.totalTime) {
      chrome.storage.local.set({ 'totalTime': 0 });
    }
    if (!result.websites) {
      chrome.storage.local.set({ 'websites': {} });
    }
    if (!result.activeTab) {
      chrome.storage.local.set({ 'activeTab': {} });
    }
  });
  
  // Update time spent on the active tab
  setInterval(function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs && tabs.length > 0) {
        var activeTab = tabs[0];
        var hostname = new URL(activeTab.url).hostname;
  
        chrome.storage.local.get('activeTab', function(result) {
          var activeTabData = result.activeTab;
          var lastActiveTabId = activeTabData.tabId;
          var lastActiveTabTime = activeTabData.time;
          var currentTime = Date.now();
  
          if (lastActiveTabId === activeTab.id) {
            var elapsedTime = currentTime - lastActiveTabTime;
  
            chrome.storage.local.get('websites', function(result) {
              var websites = result.websites;
              var timeSpent = websites[hostname] || 0;
              timeSpent += Math.round(elapsedTime / 1000); // Convert milliseconds to seconds
              websites[hostname] = timeSpent;
              chrome.storage.local.set({ 'websites': websites });
            });
  
            chrome.storage.local.get('totalTime', function(result) {
              var totalTime = result.totalTime || 0;
              totalTime += Math.round(elapsedTime / 1000); // Convert milliseconds to seconds
              chrome.storage.local.set({ 'totalTime': totalTime });
            });
          }
  
          chrome.storage.local.set({ 'activeTab': { tabId: activeTab.id, time: currentTime } });
        });
      }
    });
  }, 1000); // Update every second
  