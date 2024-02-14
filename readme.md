# Website Time Tracker

Website Time Tracker is a browser extension that allows users to track the time spent on various websites while browsing the internet.

## Features

- Tracks the total time spent on websites.
- Displays the top 3 websites visited along with the time spent on them.
- Provides an option to view all websites visited and their respective time spent.
- Automatically updates time data in real-time.
- Persists time data even after deleting and reinstalling the extension.
- Resets time data for all websites and total time spent if the date changes.

## Installation

1. Download or clone the repository to your local machine.
2. Open Google Chrome.
3. Navigate to `chrome://extensions/`.
4. Enable the "Developer mode" toggle at the top right corner.
5. Click on "Load unpacked" and select the directory where you downloaded/cloned the repository.

## Usage

- Once installed, the extension icon will appear in the Chrome toolbar.
- Click on the extension icon to view the total time spent today and the top 3 websites.
- Click on the "View All" button to see a detailed list of all websites visited and their respective time spent.

## Development

- The extension is built using HTML, CSS, and JavaScript.
- The `manifest.json` file defines the extension's properties and permissions.
- `background.js` handles background tasks such as tracking time spent and handling date changes.
- `popup.html` defines the structure of the extension's popup interface.
- `popup.js` contains the JavaScript code for updating the popup interface and interacting with storage.
- `content.js` is injected into web pages to track the active tab's hostname.

## Contributing

Contributions are welcome! If you have suggestions for new features or find any issues, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
