const mongoose = require("mongoose");


const connectTodb = () => {
    mongoose.connect(process.env.DB_URI).then((data) => {
        console.log(`Mongodb Connected With Server: ${data.connection.host}`)
    })
}

module.exports=connectTodb
