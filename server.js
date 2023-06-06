const app = require("./app");

const dotenv = require("dotenv");

const connectTodb = require("./config/database")
//configure
dotenv.config({ path: "config/config.env" })

//connecting To Database 
connectTodb();

//Handling The Uncaught Errror
process.on("uncaughtException",(err)=>{
    console.log(`Error: ${err.message}`)
    console.log("Shutdowing the Server due to the Unhandled Expection")
    process.close(
        process.exit(1)
    )
})
const server = app.listen(process.env.PORT, () => {
    console.log(`Server is working on http://localhost:${process.env.PORT}`)
})

//Handling the Promise Error
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);
  
    server.close(() => {
      process.exit(1);
    });
  });