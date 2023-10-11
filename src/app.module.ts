import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './tasks/tasks.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TasksModule,
    AuthModule,
    TypeOrmModule.forRoot({
      entities: [Task],
      type: 'postgres',
      host: 'containers-us-west-202.railway.app',
      port: 6338,
      username: 'postgres',
      password: 'BBWEhDLzA5CdUSuAhcir',
      database: 'railway',
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
})
export class AppModule {}
