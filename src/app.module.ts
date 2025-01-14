import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
// import databaseConfig from './database/postgres/dbConfig';
//
// const config = databaseConfig.development;

@Module({
  imports: [
    SequelizeModule.forRoot({
      models: [__dirname + '/models/*.model.js'],
      // dialect: config.dialect,
      // host: config.host,
      // port: config.port,
      // username: config.username,
      // password: config.password,
      // database: config.database,
      // synchronize: false,
      // autoLoadModels: true,

      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'usersdb',
      synchronize: false,
      autoLoadModels: true,
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController, UserController, AuthController],
  providers: [AppService, UserService],
})
export class AppModule {}
