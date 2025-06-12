import { DB_NAME } from "../constant.js";
import mongoose from "mongoose";


const connectDatabase = async () => {

  try {
      const connectedDatabaseInsctance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
      console.log(`MONGODB CONNECTED || DB HOST : ${connectedDatabaseInsctance.connection.host}`);
   
  } catch (error) {
    console.error("CONNECTION FAILED : db/index.js ");
    process.exit(1);
  }
}

export default connectDatabase;