import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
// import { User } from './user/models/user.model';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import 'dotenv/config';


@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
      username: process.env.DATABASE_USERNAME || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'postgres',
      database: process.env.DATABASE_NAME || 'usersdb',
      models: [__dirname + '/models/*.model.js'],   //!Attention
      autoLoadModels: true,
      synchronize: false, //for migration use
    }),
    // SequelizeModule.forFeature([User]),
    UserModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})

export class AppModule {}
