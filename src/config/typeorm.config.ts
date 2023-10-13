import { TypeOrmModuleOptions } from '@nestjs/typeorm';

console.log(1, process.env.DB_HOST);

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'containers-us-west-108.railway.app',
  port: 5825,
  username: 'postgres',
  password: 'MFl75fR3lmCW66g8GTXi',
  database: 'railway',
  autoLoadEntities: true,
  synchronize: true,
};
