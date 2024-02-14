// Initialize storage
chrome.runtime.onInstalled.addListener(function() {
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

                    // Update time spent on the current website
                    chrome.storage.local.get('websites', function(result) {
                        var websites = result.websites || {};
                        var timeSpent = websites[hostname] || 0;
                        timeSpent += Math.round(elapsedTime / 1000); // Convert milliseconds to seconds
                        websites[hostname] = timeSpent;
                        chrome.storage.local.set({ 'websites': websites });
                    });

                    // Update total time spent
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
