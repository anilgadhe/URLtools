const mongoose = require("mongoose")


async function connectDb (url){

   mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Lower timeout for faster failover
  socketTimeoutMS: 45000, // Keep socket alive
  keepAlive: true
});


}


module.exports = {
    connectDb,   
}
