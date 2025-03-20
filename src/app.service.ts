import { Injectable } from '@nestjs/common';
import * as path from 'node:path';

@Injectable()
export class AppService {
  public getMain(): string {
    return path.join(__dirname, '..', 'static', 'main', 'main_page.html');
  }
}
