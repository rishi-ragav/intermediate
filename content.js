// Send message to background script when the active tab changes
chrome.tabs.onActivated.addListener(function(activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function(tab) {
      chrome.runtime.sendMessage({ type: 'tab_change', hostname: new URL(tab.url).hostname });
    });
  });
  
  // Send message to background script when the page is loaded
  chrome.runtime.sendMessage({ type: 'tab_change', hostname: window.location.hostname });
  