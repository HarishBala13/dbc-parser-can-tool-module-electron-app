const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');
const DBCParser = require('./dbcParser');

let mainWindow;

const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Import',
                click: () => {
                    mainWindow.webContents.send('open-configure-file');
                }
            },
            {
                label: 'Save',
                click() {
                    console.log('File saved');
                }
            },
            {
                label: 'Close',
                click() {
                    console.log('File closed');
                }
            },
        ]
    },
    {
        label: 'Inspect',
        accelerator: 'Ctrl+Shift+I',
        click: () => {
            mainWindow.webContents.openDevTools();
            mainWindow.webContents.send('inspect-element');
        }
    },
    {
        label: 'Quit',
        click() {
            app.quit();
        }
    }
    // {
    //     label: 'Reload',
    //     accelerator: 'Cmd+Ctrl+R',
    //     click: () => {
    //         const focusedWindow = BrowserWindow.getFocusedWindow();
    //         if (focusedWindow) {
    //             focusedWindow.reload();
    //         } else {
    //             console.log("Reload is disabled in this state.");
    //         }
    //     }
    // }
];

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.loadURL(path.join(__dirname, '/dist/dbc-parser-app/browser/index.html'));


    const menu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(menu);

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

ipcMain.handle('parse-dbc', async (event, fileContent) => {
    try {
        // const fileContent = fs.readFileSync(filePath, 'utf-8');
        const parsedData = new DBCParser.parse(fileContent);
        return parsedData;
    } catch (error) {
        console.error('Error parsing DBC file:', error);
        return { error: 'Failed to parse DBC file' };
    }
})

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
