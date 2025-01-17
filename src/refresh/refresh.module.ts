import { Module } from '@nestjs/common';
import { RefreshService } from './refresh.service';

@Module({
  providers: [RefreshService],
  exports: [RefreshService], // Експортуємо, щоб інші модулі могли використовувати цей сервіс
})
export class RefreshModule {}
