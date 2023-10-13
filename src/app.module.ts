import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // ENVIRONMENT
    ConfigModule.forRoot({ envFilePath: ['.env.stage.dev'] }),

    // DATABASE
    // TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (service: ConfigService) => {
        return {
          type: 'postgres',
          host: service.get('DB_HOST'),
          port: service.get('DB_PORT'),
          username: service.get('DB_USER'),
          password: service.get('DB_PASSWD'),
          database: service.get('DB_BASE'),
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),

    // MODULES
    TasksModule,
    AuthModule,
  ],
})
export class AppModule {}
