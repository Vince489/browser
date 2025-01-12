// Reference input and webview
const urlInput = document.getElementById('url');
const webview = document.getElementById('webview');

// Handle Enter key press in the URL input field
urlInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') { // Check for Enter key
        const url = urlInput.value.startsWith('http') || urlInput.value.startsWith('vizz://')
            ? urlInput.value
            : `http://${urlInput.value}`;
        webview.src = url;
    }
});

// Declare and initialize variables
let webviewReady = false; // Track if the webview is ready
const backButton = document.getElementById('back');
const forwardButton = document.getElementById('forward');
const refreshButton = document.getElementById('refresh');

// Wait for the webview to be ready
webview.addEventListener('dom-ready', () => {
    webviewReady = true;
    console.log('Webview is ready');
});

// Navigate Back
backButton.addEventListener('click', () => {
    if (webviewReady && webview.canGoBack()) {
        webview.goBack();
    }
});

// Navigate Forward
forwardButton.addEventListener('click', () => {
    if (webviewReady && webview.canGoForward()) {
        webview.goForward();
    }
});

// Refresh the Page
refreshButton.addEventListener('click', () => {
    if (webviewReady) {
        webview.reload();
    } else {
        console.warn('The WebView is not ready yet.');
    }
});

// Update the input field when the webview navigates
webview.addEventListener('did-navigate', (event) => {
    urlInput.value = event.url;
});

// Debugging: log messages from webview
webview.addEventListener('did-fail-load', (event) => {
    console.error(`Failed to load URL: ${event.validatedURL}, Error Code: ${event.errorCode}`);
});
