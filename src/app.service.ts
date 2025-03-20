import { Injectable } from '@nestjs/common';
import * as path from 'node:path';

@Injectable()
export class AppService {
  public getMain(): string {
    return path.join(__dirname, '..', 'static', 'main', 'main_page.html');
  }


  public getTermsOfService(): string {
    return path.join(__dirname, '..', 'static', 'privacy', 'delete_data_instructions.html');
  }
}
