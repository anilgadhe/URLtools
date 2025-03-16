require('dotenv').config()
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const {restrictToLoggedinUserOnly, checkAuth } = require("./middlewares/auth")
const {connectDb}= require("./connection");
const URL = require('./modules/url');

const urlRoute = require("./routers/url")
const userRoute= require("./routers/user");
const staticRoute = require("./routers/staticRouter");


const app = express();
const PORT =process.env.PORT|| 8000;


app.get('/favicon.ico', (req, res) => res.status(204).end());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));


connectDb(process.env.MONGO_URL).then(()=>{
  console.log("mongoDB is connected")
});

 app.use(checkAuth);
app.use("/user",userRoute);      
 app.use("/",userRoute);
 app.use("/url", urlRoute);
 app.use("/",staticRoute);



app.set('view engine', 'ejs');
app.set('views',path.resolve('./views'));




// app.get('/',restrictToLoggedinUserOnly, async (req,res)=>{
//   const loggedInUser = await User.findById(req.user._id);

//   if (!req.user) {
//     console.log("ERROR: req.user is undefined in route!");
// }
//  return res.render("home",{

//   user: loggedInUser,
//  });
// });




app.get('/:shortId', async (req, res) => {
  const shortId = req.params.shortId;
  try {
      // Find the entry and update visitHistory
      const entry = await URL.findOneAndUpdate(
          { shortId },
          { 
              $push: {
                  visitHistory: { timestamp: Date.now() }
              }
          },
          { new: true }  // Ensure the updated document is returned
      );

      // Check if entry is found and redirectedURL exists
      if (entry && entry.redirectedURL) {
          return res.redirect(entry.redirectedURL);
      } else {
          
          return res.status(404).send('Short URL not found');
      }
  } catch (err) {
      console.log("ERROR-", err);
      return res.status(500).send('Internal Server Error');
  }
});


app.use(express.static("."));
module.exports = app;
