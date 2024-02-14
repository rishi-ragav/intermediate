// Initialize storage and set the initial date
chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.get(['totalTime', 'websites', 'activeTab', 'date'], function(result) {
      if (!result.totalTime) {
          chrome.storage.sync.set({ 'totalTime': 0 });
      }
      if (!result.websites) {
          chrome.storage.sync.set({ 'websites': {} });
      }
      if (!result.activeTab) {
          chrome.storage.sync.set({ 'activeTab': {} });
      }
      if (!result.date) {
          chrome.storage.sync.set({ 'date': getCurrentDate() });
      }
  });
});

// Update time spent on the active tab
setInterval(function() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs && tabs.length > 0) {
          var activeTab = tabs[0];
          var hostname = new URL(activeTab.url).hostname;

          chrome.storage.sync.get('activeTab', function(result) {
              var activeTabData = result.activeTab;
              var lastActiveTabId = activeTabData.tabId;
              var lastActiveTabTime = activeTabData.time;
              var currentTime = Date.now();

              if (lastActiveTabId === activeTab.id) {
                  var elapsedTime = currentTime - lastActiveTabTime;

                  // Update time spent on the current website
                  chrome.storage.sync.get('websites', function(result) {
                      var websites = result.websites || {};
                      var timeSpent = websites[hostname] || 0;
                      timeSpent += Math.round(elapsedTime / 1000); // Convert milliseconds to seconds
                      websites[hostname] = timeSpent;
                      chrome.storage.sync.set({ 'websites': websites });
                  });

                  // Update total time spent
                  chrome.storage.sync.get('totalTime', function(result) {
                      var totalTime = result.totalTime || 0;
                      totalTime += Math.round(elapsedTime / 1000); // Convert milliseconds to seconds
                      chrome.storage.sync.set({ 'totalTime': totalTime });
                  });
              }

              chrome.storage.sync.set({ 'activeTab': { tabId: activeTab.id, time: currentTime } });
          });
      }

  });
}, 1000); // Update every second

// Check for date change and reset time data accordingly
setInterval(function() {
  chrome.storage.sync.get('date', function(result) {
      var currentDate = getCurrentDate();
      if (result.date !== currentDate) {
          chrome.storage.sync.set({ 'date': currentDate }); // Update current date

          // Reset time data
          chrome.storage.sync.set({ 'totalTime': 0 });
          chrome.storage.sync.set({ 'websites': {} });
      }
  });
}, 60000); // Check every minute for date change

// Send the hostname to the background script whenever the page loads or the tab changes
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
      chrome.runtime.sendMessage({ type: 'tab_change', hostname: new URL(tab.url).hostname });
  }
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
  chrome.tabs.get(activeInfo.tabId, function(tab) {
      chrome.runtime.sendMessage({ type: 'tab_change', hostname: new URL(tab.url).hostname });
  });
});

// Helper function to get current date in yyyy-mm-dd format
function getCurrentDate() {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
  var yyyy = today.getFullYear();
  return yyyy + '-' + mm + '-' + dd;
}
