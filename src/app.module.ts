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
import { PostService } from './post/post.service';
import { Post } from './post/post';
import { PostController } from './post/post.controller';
import { PostModule } from './post/post.module';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChapterController } from './chapter/chapter.controller';
import { ChapterService } from './chapter/chapter.service';
import { Chapter } from './chapter/chapter';
import { ChapterModule } from './chapter/chapter.module';
import { TopicController } from './topic/topic.controller';
import { Topic } from './topic/topic';
import { TopicModule } from './topic/topic.module';
import * as process from 'node:process';
import { ormDbConfig } from '@/src/database/postgres/type-orm/database-config';


@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      models: [__dirname + '/entities/*.model.js'],
      dialect: (process.env.DATABASE_DIALECT as Dialect) || 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      synchronize: false,
      autoLoadModels: true,
    }),
    TypeOrmModule.forRoot(ormDbConfig),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'static/mail/templates'),
      serveRoot: '/templates',
    }),
    UserModule,
    AuthModule,
    RefreshModule,
    PersonalInfoModule,
    ResetPasswordModule,
    MailModule,
    PostModule,
    ChapterModule,
    TopicModule,
  ],
  controllers: [
    AppController,
    UserController,
    AuthController,
    PersonalInfoController,
    ResetPasswordController,
    PostController,
    ChapterController,
    TopicController,
  ],
  providers: [
    AppService,
    UserService,
    RefreshService,
    PersonalInfo,
    ResetPasswordService,
    MailService,
    PostService,
    Post,
    ChapterService,
    Chapter,
    Topic,
  ],
})
export class AppModule {}
