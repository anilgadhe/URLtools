const mongoose = require("mongoose")


async function connectDb (url){

    return await mongoose.connect(url);

}


module.exports = {
    connectDb,   
}