import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserController } from '@/src/users/user.controller';
import { UserModule } from '@/src/users/user.module';
import { UserService } from '@/src/users/user.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { RefreshService } from './refresh/refresh.service';
import { RefreshModule } from './refresh/refresh.module';
import { Dialect } from 'sequelize';
import { ConfigModule } from '@nestjs/config';
import { PersonalInfoController } from './personal-info/personal-info.controller';
import { PersonalInfo } from './personal-info/personal-info';
import { PersonalInfoModule } from '@/src/personal-info/personal-info.module';

// import { databaseConfig } from './database/postgres/dbConfig';
import { ResetPasswordService } from './reset-password/reset-password.service';
import { ResetPasswordModule } from './reset-password/reset-password.module';
// const config = databaseConfig.development;


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      models: [__dirname + '/models/*.model.js'],
      dialect: (process.env.DATABASE_DIALECT as Dialect) || 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      synchronize: false,
      autoLoadModels: true,
    }),
    UserModule,
    AuthModule,
    RefreshModule,
    PersonalInfoModule,
    ResetPasswordModule,
  ],
  controllers: [
    AppController,
    UserController,
    AuthController,
    PersonalInfoController,
  ],
  providers: [AppService, UserService, RefreshService, PersonalInfo, ResetPasswordService],
})
export class AppModule {}
