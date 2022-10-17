import cron from "node-cron";
import { saveCryptoLists } from "../controllers/crypto-lists.controller";

// FIXME: this scheduler is not working
// cron.schedule("*/2 * * * *", async () => {
//   const savedResponse = await saveCryptoLists();
//   console.log("scheduler running");
//   console.log(savedResponse);
// });
