import connectDatabase from "./db/index.js";


connectDatabase();









































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