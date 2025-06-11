import connectDatabase from "./db/index.js";
import dotenv from "dotenv";
import { app } from "./app.js";

dotenv.config({
    path : './.env',
})


const port = process.env.PORT || 6000


connectDatabase().then(() => {
    app.listen(port, () => {
        console.log(`⚙️ Your app is running on port ${port}`)
    })
}).catch((error) => {
    console.log(`❎ DB could not be connected .... ${error.message}`);
})









































// import express from "express"
// const app = express();


// ;(async () => {

//     try {
//        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
       
//        app.on("APP CAN't CONNECT TO MONGODB ", (error) => {
//         console.error(`ERROR IN COMMUNICATION ${error}`);
//         throw error;
//        })

//        app.listen(process.env.PORT, () => {
//         console.log('example app is listning on port ',process.env.PORT);
//        })
        
//     } catch (error) {
//         console.error(`CONNECTION FAILED ERROR ${process.env.MONGODB_URI} ${error}`);
//         throw error;
//     }

// })()