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
import { join } from 'path';
import { ResetPasswordService } from './reset-password/reset-password.service';
import { ResetPasswordModule } from './reset-password/reset-password.module';
import { ResetPasswordController } from '@/src/reset-password/reset-password.controller';
import { MailService } from './mail/mail.service';
import { MailModule } from '@/src/mail/mail.module';
import configuration from '@/src/mail/configuration/configuration';
import { ServeStaticModule } from '@nestjs/serve-static';
// import { databaseConfig } from './database/postgres/dbConfig';
// const config = databaseConfig.development;

console.log('Resolved path:', join(__dirname, 'static'));

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'static/mail/templates'),
      serveRoot: '/templates', // Files should be available at http://localhost:3000/templates
    }),
    UserModule,
    AuthModule,
    RefreshModule,
    PersonalInfoModule,
    ResetPasswordModule,
    MailModule,
  ],
  controllers: [
    AppController,
    UserController,
    AuthController,
    PersonalInfoController,
    ResetPasswordController,
  ],
  providers: [
    AppService,
    UserService,
    RefreshService,
    PersonalInfo,
    ResetPasswordService,
    MailService,
  ],
})
export class AppModule {}
