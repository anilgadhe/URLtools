
const User = require("../modules/user");
const {setUser} = require("../service/auth");



async function handleUserSingup( req, res){
   const {name , email , password} = req.body ;
   await User.create({
    name,
    email,
    password
   });
   return res.render("login");

}

 async function handleUserLogin(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.matchPassword(email, password);

    const token = setUser(user);
    res.cookie("uid", token);

    // No need to findById again. You already have user!
    return res.render("home", {
      user: user,
    });
  } catch (error) {
    return res.render("login", {
      error: "incorrect Email or password",
    });
  }
}


 async function getLogin(req,res){
 
 return  res.render('login');
 }

 async function getSignup(req,res){
  return res.render("signup")
 }

 
module.exports = {
    handleUserSingup,
    handleUserLogin,
    getLogin,
    getSignup,
}
