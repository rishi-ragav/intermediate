document.addEventListener('DOMContentLoaded', function() {
    var isViewAll = false; // Flag to track if 'View All' button is clicked

    var viewAllButton = document.getElementById('viewAllButton');
    var allWebsitesContainer = document.getElementById('allWebsitesContainer');
    var top3List = document.getElementById('top3List');

    viewAllButton.addEventListener('click', function() {
        isViewAll = !isViewAll; // Toggle isViewAll flag

        if (isViewAll) {
            viewAllButton.textContent = 'Minimize List';
            allWebsitesContainer.style.display = 'block';
            top3List.style.display = 'none';
        } else {
            viewAllButton.textContent = 'View All';
            allWebsitesContainer.style.display = 'none';
            top3List.style.display = 'block';
        }
    });

    // Function to update the time data in the popup
    function updateTimeData() {
        chrome.storage.local.get(['totalTime', 'websites'], function(result) {
            var totalTime = result.totalTime || 0;
            var websites = result.websites || {};

            // Update total time spent
            document.getElementById('totalTime').textContent = formatTime(totalTime);

            // Update top 3 websites
            updateTop3Websites(websites);

            // Update all websites if 'View All' button is clicked
            if (isViewAll) {
                updateAllWebsites(websites);
            }
        });
    }

    // Update top 3 websites
    function updateTop3Websites(websites) {
        var top3List = document.getElementById('top3List');
        top3List.innerHTML = '';

        // Convert the websites object into an array of [website, timeSpent] pairs
        var websitesArray = Object.entries(websites);

        // Sort the websites array based on the time spent in descending order
        websitesArray.sort(function(a, b) {
            return b[1] - a[1]; // Compare the time spent in descending order
        });

        // Display only the top 3 websites
        for (var i = 0; i < Math.min(3, websitesArray.length); i++) {
            var website = simplifyWebsiteName(websitesArray[i][0]); // Simplify website name
            var timeSpent = websitesArray[i][1];
            var listItem = document.createElement('li');
            listItem.textContent = website + ': ' + formatTime(timeSpent);
            top3List.appendChild(listItem);
        }
    }

    // Update all websites
    function updateAllWebsites(websites) {
        var allWebsitesList = document.getElementById('allWebsitesList');
        allWebsitesList.innerHTML = '';

        // Convert the websites object into an array of [website, timeSpent] pairs
        var websitesArray = Object.entries(websites);

        // Sort the websites array based on the time spent in descending order
        websitesArray.sort(function(a, b) {
            return b[1] - a[1]; // Compare the time spent in descending order
        });

        // Display all websites
        for (var i = 0; i < websitesArray.length; i++) {
            var simplifiedName = simplifyWebsiteName(websitesArray[i][0]); // Simplify website name
            var timeSpent = websitesArray[i][1];
            var listItem = document.createElement('li');
            listItem.textContent = simplifiedName + ': ' + formatTime(timeSpent);
            allWebsitesList.appendChild(listItem);
        }
    }

    // Helper function to simplify website name
    function simplifyWebsiteName(website) {
        // Replace "chat.openai" with "ChatGPT"
        if (website.includes('chat.openai')) {
            return 'ChatGPT';
        }

        // Extract text after "//"
        var startIndex = website.indexOf('//');
        var textAfterDoubleSlash = (startIndex !== -1) ? website.substring(startIndex + 2) : website;

        // Remove "www." if present
        textAfterDoubleSlash = textAfterDoubleSlash.replace(/^www\./i, '');

        // Remove TLD if present
        var tldIndex = textAfterDoubleSlash.lastIndexOf('.');
        var simplifiedName = (tldIndex !== -1) ? textAfterDoubleSlash.substring(0, tldIndex) : textAfterDoubleSlash;

        return simplifiedName.charAt(0).toUpperCase() + simplifiedName.slice(1); // Capitalize first letter
    }

    // Helper function to format time
    function formatTime(seconds) {
        var hours = Math.floor(seconds / 3600);
        var minutes = Math.floor((seconds % 3600) / 60);
        var remainingSeconds = seconds % 60;
        return hours + 'h ' + minutes + 'm ' + remainingSeconds + 's';
    }

    // Update time data initially
    updateTimeData();

    // Update time data every second
    setInterval(updateTimeData, 1000); // Update every 1 second
});
