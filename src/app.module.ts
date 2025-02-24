import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DbModule } from './db/db.module';
import { ServicesModule } from './services/services.module';
import { ControllersModule } from './controllers/controllers.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI')
      }), inject: [ConfigService]
    }),
    DbModule,
    ServicesModule,
    ControllersModule],
})
export class AppModule { }
