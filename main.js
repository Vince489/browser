const { app, BrowserWindow, protocol, globalShortcut } = require('electron');
const mongoose = require('mongoose');
const https = require('https'); // For fetching remote URLs
const DnsMapping = require('./model/dnsMap'); // Import the model
const connectToDatabase = require('./connect'); // Import the DB connection function

let mainWindow;

// Connect to MongoDB
connectToDatabase();

app.on('ready', () => {
    // Register custom protocol for "vizz://" domains
    protocol.handle('vizz', async (request) => {
        const url = request.url.replace('vizz://', ''); // Strip "vizz://" prefix
        console.log(`Requested URL (vizz): ${url}`);
    
        try {
            // Fetch the DNS mapping from MongoDB
            const dnsMapping = await DnsMapping.findOne({ domain: url });
    
            if (dnsMapping) {
                const resolvedUrl = dnsMapping.filePath;
    
                if (resolvedUrl.startsWith('http://') || resolvedUrl.startsWith('https://')) {
                    console.log(`Resolved URL (vizz): ${resolvedUrl}`);
                    mainWindow.loadURL(resolvedUrl); // Load the resolved URL in Electron
                } else {
                    console.error(`Invalid URL format in MongoDB: ${resolvedUrl}`);
                    mainWindow.loadURL('data:text/html,<h1>Invalid URL in database</h1>');
                }
            } else {
                console.error(`Domain not found in database: ${url}`);
                mainWindow.loadURL('data:text/html,<h1>404 - Not Found</h1>'); // Simple 404 page
            }
        } catch (error) {
            console.error(`Error handling request for ${url}:`, error);
            mainWindow.loadURL('data:text/html,<h1>500 - Internal Server Error</h1>'); // Simple error page
        }
    });
    
    
    
    // Get the current screen's dimensions
    const { width, height } = require('electron').screen.getPrimaryDisplay().workAreaSize;

    // Create the main browser window
    mainWindow = new BrowserWindow({
        width: width,
        height: height,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webviewTag: true,
        },
        frame: true, 
    });

    // Hide the default menu bar
    mainWindow.setMenuBarVisibility(false);

    // Load the main UI
    mainWindow.loadFile('index.html'); // Load the main UI without path

    // Register a global shortcut for Ctrl+F12 to toggle DevTools
    const isShortcutRegistered = globalShortcut.register('Control+F12', () => {
        if (mainWindow) {
            if (mainWindow.webContents.isDevToolsOpened()) {
                mainWindow.webContents.closeDevTools(); 
            } else {
                mainWindow.webContents.openDevTools(); 
            }
        }
    });

    console.log(`Shortcut Ctrl+F12 registered: ${isShortcutRegistered}`);
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});
