const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    ipcRenderer: {
        send: (channel, data) => ipcRenderer.send(channel, data),
        on: (channel, listener) => ipcRenderer.on(channel, listener),
        invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
    }
});
