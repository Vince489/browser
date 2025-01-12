const { app, BrowserWindow, protocol, Menu, globalShortcut } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

// DNS map for custom domains
const dnsMap = {
    'virtron.meta': path.join(__dirname, 'sites/meta/index.html'),
    'example.huh': path.join(__dirname, 'sites/example/index.html'),
};

const publicPath = path.join(__dirname, 'public');

app.on('ready', () => {
    // Register custom protocol for "vizz://" domains
    protocol.handle('vizz', async (request) => {
        const url = request.url.replace('vizz://', ''); // Remove protocol prefix
        console.log(`Requested URL (vizz): ${url}`);
    
        const filePath = dnsMap[url];
        if (filePath) {
            console.log(`Resolved file path (vizz): ${filePath}`);
            try {
                const data = await fs.promises.readFile(filePath); // Read the file
                return new Response(data, {
                    headers: { 'Content-Type': 'text/html' }, // Adjust content type as needed
                });
            } catch (error) {
                console.error(`Error reading file: ${filePath}`, error);
                return new Response('Internal Server Error', { status: 500 });
            }
        } else {
            console.error(`Domain not found in DNS map: ${url}`);
            try {
                const errorData = await fs.promises.readFile(path.join(__dirname, '404.html'));
                return new Response(errorData, {
                    headers: { 'Content-Type': 'text/html' },
                    status: 404,
                });
            } catch (error) {
                console.error(`Error reading 404.html`, error);
                return new Response('Not Found', { status: 404 });
            }
        }
    });
    

    // Register custom protocol for static files in the "public" directory
    protocol.registerFileProtocol('public', (request, callback) => {
        const url = request.url.replace('public://', ''); // Remove protocol prefix
        const filePath = path.join(publicPath, url); // Build the file path
        console.log(`Requested URL (public): ${filePath}`);
        callback({ path: filePath });
    });

    // Get the current screen's dimensions
    const { width, height } = require('electron').screen.getPrimaryDisplay().workAreaSize;

    // Create the main browser window
    mainWindow = new BrowserWindow({
        width: width,
        height: height,
        webPreferences: {
            nodeIntegration: true, // Enable Node.js integration
            contextIsolation: false, // Disable context isolation
            webviewTag: true, // Enable webview support
        },
        frame: true, // Enable frame for custom title bar
    });

    // Hide the default menu bar
    mainWindow.setMenuBarVisibility(false);

    // Load the main UI
    mainWindow.loadFile(path.join(__dirname, 'index.html'));

    // Register a global shortcut for Ctrl+F12 to toggle DevTools
    const isShortcutRegistered = globalShortcut.register('Control+F12', () => {
        if (mainWindow) {
            if (mainWindow.webContents.isDevToolsOpened()) {
                mainWindow.webContents.closeDevTools(); // Close if already open
            } else {
                mainWindow.webContents.openDevTools(); // Open if closed
            }
        }
    });

    // Log if the shortcut registration was successful
    console.log(`Shortcut Ctrl+F12 registered: ${isShortcutRegistered}`);
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('will-quit', () => {
    // Unregister all shortcuts when the app quits
    globalShortcut.unregisterAll();
});
