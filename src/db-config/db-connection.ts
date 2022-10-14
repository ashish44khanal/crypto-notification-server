import { DB_DATA_SOURCE } from "./data-source";

export const db_connect = async () => {
  // await app.listen(PORT);
  try {
    await DB_DATA_SOURCE.initialize().then(() => {
      console.log("Database Connected Successfully !");
    });
  } catch (error) {
    console.error(error);
  }
};
