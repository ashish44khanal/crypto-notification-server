"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB_DATA_SOURCE = void 0;
const typeorm_1 = require("typeorm");
exports.DB_DATA_SOURCE = new typeorm_1.DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "crypto",
    entities: ["dist/**/*.entity{.ts,.js}", "src/**/*.entity{.ts,.js}"],
    synchronize: true,
    // logging: true,
});
