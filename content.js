// Send the hostname to the background script
chrome.runtime.sendMessage({hostname: window.location.hostname});
