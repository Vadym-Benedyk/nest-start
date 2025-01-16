import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { databaseConfig } from './database/postgres/dbConfig';
import { RefreshTokenController } from './refresh-token/refresh-token.controller';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import { RefreshService } from './refresh/refresh.service';
import { RefreshModule } from './refresh/refresh.module';

const config = databaseConfig.development;

@Module({
  imports: [
    SequelizeModule.forRoot({
      models: [__dirname + '/models/*.model.js'],
      dialect: config.dialect,
      host: config.host,
      port: config.port,
      username: config.username,
      password: config.password,
      database: config.database,
      synchronize: false,
      autoLoadModels: true,
    }),
    UserModule,
    AuthModule,
    RefreshTokenModule,
    RefreshModule,
  ],
  controllers: [AppController, UserController, AuthController, RefreshTokenController],
  providers: [AppService, UserService, RefreshService],
})
export class AppModule {}
