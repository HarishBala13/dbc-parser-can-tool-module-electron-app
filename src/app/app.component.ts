import { Component, inject } from '@angular/core';
import { DbcParserService } from '../dbc-parser.service';
import { ElectronService } from 'ngx-electron';  // Import ElectronService
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  providers: [ElectronService, DbcParserService],  // Add ElectronService here for standalone components
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'dbc-parser-app';
  dbcData: any = null;
  filePath: string = '';
  fileContent: any;
  errorMessage: string = '';
  length: number = 0;

  private dbcParserService = inject(DbcParserService);  // Using Angular's new DI

  onFileSelected(event: any) {
    const file = event.target.files[0];
    console.log(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const fileContent = e.target?.result;
        this.parseDBCFile(fileContent)
      };
      reader.readAsText(file);
    }
  }

  async parseDBCFile(fileContent: string | ArrayBuffer | null | undefined) {
    try {
      const result = await this.dbcParserService.parseDBC(fileContent);
      console.log('Parsed DBC Data:', result);
      this.dbcData = result;
      this.length = result.length;
    } catch (error) {
      console.error('Error parsing DBC file:', error);
    }
  }
}
