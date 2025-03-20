import { Module } from '@nestjs/common';
import { OAuthStrategyService } from './o-auth-strategy.service';
import { OAuthStrategy } from './o-auth-strategy';

@Module({
  providers: [OAuthStrategyService, OAuthStrategy]
})
export class OAuthStrategyModule {}
