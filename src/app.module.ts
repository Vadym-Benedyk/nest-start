import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import databaseConfig from './database/postgres/dbConfig.general';


@Module({
  imports: [
    SequelizeModule.forRoot({
      models: [__dirname + '/models/*.model.js'],
     ...databaseConfig
    }),
    UserModule,
  ],
  controllers: [AppController, UserController],
  providers: [AppService, UserService],
})

export class AppModule {}
