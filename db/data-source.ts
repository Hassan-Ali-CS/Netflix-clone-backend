import { DataSource, DataSourceOptions } from "typeorm";
import * as dotenv from 'dotenv'; //Imports the package which is used to load environment variables from .env into process.env  
dotenv.config() //initializes the package, which reads the .env file in the root and loads its contents into process.env
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  entities: ['dist/**/*.entity{.js,.ts}'],
  migrations: ['dist/db/migrations/*{.js,.ts}'],

};
const dataSource = new DataSource(dataSourceOptions);
export default dataSource;