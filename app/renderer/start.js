const electron = require('electron')
const app = electron.app
const path = require('path')
const isDev = require('electron-is-dev')
if (isDev)
    require('electron-reload')
const BrowserWindow = electron.BrowserWindow

//if (isDev)
    //const { default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require('electron-devtools-installer');

let mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false
        },
    })
    
    /*if (isDev) {
        installExtension(REACT_DEVELOPER_TOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err));

        installExtension(REDUX_DEVTOOLS)
            .then((name) => console.log(`Added Extension:  ${name}`))
            .catch((err) => console.log('An error occurred: ', err));
    }*/

    setTimeout(_ => {
        mainWindow.loadURL(
            isDev
                ? 'http://localhost:3000'
                : `file://${path.join(__dirname, '../build/index.html')}`,
        )
    }, 2000)

    mainWindow.on('closed', () => {
        mainWindow = null
    })

    mainWindow.webContents.openDevTools()
    mainWindow.setAutoHideMenuBar(true)
}
app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})