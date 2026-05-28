import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SessionModule } from './session/session.module';
import { AssetsModule } from './assets/assets.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get('DATABASE_URL'),
        entities: [join(__dirname, '**', '*.entity.{ts,js}')],
        synchronize: true,
        ssl: config.get('DATABASE_URL')?.includes('render.com')
          ? { rejectUnauthorized: false }
          : false,
      }),
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'assets'),
      serveRoot: '/assets',
    }),

    SessionModule,
    AssetsModule,
  ],
})
export class AppModule {}
