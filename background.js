// Check if date has changed
function checkDateChange() {
    chrome.storage.local.get('lastDate', function(result) {
        var lastDate = result.lastDate;

        var currentDate = new Date();
        var currentDateString = currentDate.toDateString();

        if (lastDate !== currentDateString) {
            // Date has changed, reset time data
            chrome.storage.local.set({
                'websites': {},
                'totalTime': 0,
                'lastDate': currentDateString
            });
        }
    });
}

// Check date change on extension start
checkDateChange();

// Update time spent on the active tab
setInterval(function() {
    checkDateChange(); // Check for date change

    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        if (tabs && tabs.length > 0) {
            var activeTab = tabs[0];
            var hostname = new URL(activeTab.url).hostname;

            var currentTime = Date.now();

            chrome.storage.local.get('activeTab', function(result) {
                var activeTabData = result.activeTab;
                var lastActiveTabId = activeTabData ? activeTabData.tabId : null;
                var lastActiveTabTime = activeTabData ? activeTabData.time : null;

                if (lastActiveTabId === activeTab.id) {
                    var elapsedTime = currentTime - lastActiveTabTime || 0;

                    chrome.storage.local.get(['websites', 'totalTime'], function(result) {
                        var websites = result.websites || {};
                        var totalTime = result.totalTime || 0;

                        // Update time spent on the current website
                        var timeSpent = websites[hostname] || 0;
                        timeSpent += Math.round(elapsedTime / 1000); // Convert milliseconds to seconds
                        websites[hostname] = timeSpent;

                        // Update total time spent
                        totalTime += Math.round(elapsedTime / 1000); // Convert milliseconds to seconds

                        // Save updated data
                        chrome.storage.local.set({
                            'websites': websites,
                            'totalTime': totalTime,
                            'activeTab': { tabId: activeTab.id, time: currentTime }
                        });
                    });
                } else {
                    // If the tab changed, update activeTab info
                    chrome.storage.local.set({ 'activeTab': { tabId: activeTab.id, time: currentTime } });
                }
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
