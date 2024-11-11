import { inject, Injectable } from '@angular/core';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import { ElectronService } from 'ngx-electron';

@Injectable({
  providedIn: 'root'  // This is correct; no need for any additional configuration in the module
})
export class DbcParserService {

  private electronService = inject(ElectronService);  // Correct injection using Angular's inject()

  public ipc: typeof ipcRenderer | undefined;

  constructor() {
    this.ipc = (window as any).electron ? (window as any).electron.ipcRenderer : undefined;
    if (!this.ipc)
      console.warn('Electron\'s IPC was not loaded');
  }

  async parseDBC(fileContent: string | ArrayBuffer | null | undefined): Promise<any> {
    try {
      const result = await (window as any).electron.ipcRenderer.invoke('parse-dbc', fileContent);
      return result;
    } catch (error) {
      throw new Error(`Error parsing DBC file: ${error}`);
    }
  }

  send(channel: any, ...args: any[]): void {
    if (this.ipc) {
      this.ipc.send(channel, ...args);
    }
  }

  on(channel: any, listener: (event: IpcRendererEvent, ...args: any[]) => void): void {
    if (this.ipc) {
      this.ipc.on(channel, listener);
    }
  }

  removeListener(channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void): void {
    if (this.ipc) {
      this.ipc.removeListener(channel, listener);
    }
  }
}