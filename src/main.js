const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const kill = require('tree-kill'); // Ensures all child processes are killed

let mainWindow;
let backendProcess;

// Start the Flask backend
const startBackend = () => {
    backendProcess = spawn('python', ['src/users.py'], { shell: true });

    backendProcess.stdout.on('data', (data) => {
        console.log(`Backend output: ${data}`);
    });

    backendProcess.stderr.on('data', (data) => {
        console.error(`Backend error: ${data}`);
    });

    backendProcess.on('close', (code) => {
        console.log(`Backend exited with code: ${code}`);
    });
};

// Stop the backend process
const stopBackend = () => {
    if (backendProcess) {
        console.log('Stopping backend process...');
        kill(backendProcess.pid, 'SIGKILL', (err) => {
            if (err) {
                console.error('Error killing backend process:', err);
            } else {
                console.log('Backend process terminated.');
            }
        });
        backendProcess = null;
    }
};

app.on('ready', () => {
    Menu.setApplicationMenu(null);

    // Start the Flask backend
    startBackend();

    // Create the Electron window
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 700,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
        },
        icon: path.join(__dirname, 'images/logo.ico'),
    });

    mainWindow.loadURL('http://127.0.0.1:5000/login');

    mainWindow.on('closed', () => {
        mainWindow = null;
        stopBackend(); // Stop the backend when the window is closed
    });
});

app.on('window-all-closed', () => {
    // Stop the backend process
    stopBackend();

    // Quit the application
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('quit', () => {
    stopBackend(); // Ensure the backend process is terminated on app quit
});
