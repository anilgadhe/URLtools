require('dotenv').config()
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const ejsMate = require("ejs-mate");
const {restrictToLoggedinUserOnly, checkAuth } = require("./middlewares/auth")
const {connectDb}= require("./connection");
const qrRoute = require("./routers/qr")
const ExpressError =require("./utils/expressError")
const urlRoute = require("./routers/url")
const userRoute= require("./routers/user");
const staticRoute = require("./routers/staticRouter");


const app = express();
const PORT =process.env.PORT|| 8000;


app.get('/favicon.ico', (req, res) => res.status(204).end());
app.use(express.static(path.join(__dirname)));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));


connectDb(process.env.MONGO_URL).then(()=>{
  console.log("mongoDB is connected")
});




 app.use(checkAuth);      
 app.use("/",userRoute);
 app.use("/url",restrictToLoggedinUserOnly, urlRoute);
 app.use("/", staticRoute);
 app.use("/",qrRoute)


 app.set('view engine', 'ejs');
 app.set('views',path.resolve('./views'));
 app.engine('ejs',ejsMate);
 


app.all("*",(req,res,next)=>{
  next(new ExpressError(404 ,"Page Not Found!"));
  
});

app.use((err,req,res,next)=>{
  let {statusCode=500,message="something went wrong"}= err;
  // res.status(statusCode).send(message);
  res.status(statusCode).render("error", { message });

})


app.listen(PORT,()=>{
    console.log(`server is live on ${PORT}`);
    
});