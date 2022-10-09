import { join } from "path";
import { DataSource } from "typeorm";
export const DB_DATA_SOURCE = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "",
  database: "crypto",
  entities: [join(__dirname, "**", "*.entity.{ts,js}")],
  synchronize: true,
  // logging: true,
});
