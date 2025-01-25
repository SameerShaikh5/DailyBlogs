const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getRegister = async (req, res) => {
  let message = req.flash("message");
  res.render("register", { message });
};

const postRegister = async (req, res) => {
  let { name, email, password } = req.body;

  if (!name || !email || !password) {
    req.flash("message", { text: "Please enter credentials.", type: "danger" });
    return res.redirect("/users/register");
  }

  // triming white spaces before texts
  name = name.trim();
  email = email.trim();
  password = password.trim();

  email = email.toLowerCase();

  // Validate Email
  let emailRegex = /^[a-z][a-z0-9._-]*@[a-z0-9._-]+\.[a-z]{2,3}$/gi;
  if (!emailRegex.test(email)) {
    req.flash("message", { text: "Invalid Email!!", type: "danger" });
    return res.redirect("/users/register");
  }

  // Validate Password
  let passwordRegex = /^[^\s]+$/;
  if (!passwordRegex.test(password)) {
    req.flash("message", {
      text: "Password must not contain white spaces in between!!",
      type: "danger",
    });
    return res.redirect("/users/register");
  }

  let existinguser = await userModel.findOne({ email: email });
  if (existinguser) {
    req.flash("message", { text: "User Already Exists!!", type: "danger" });
    return res.redirect("/users/register");
  }

  try {
    let hash = await bcrypt.hash(password, 10);
    let user = await userModel.create({
      name,
      email,
      password: hash,
    });

    //If its the very first user
    let allUsers = await userModel.find();
    if (allUsers.length == 1) {
      user.isAdmin = true;
      await user.save();
    }

    let token = jwt.sign({ email: email }, process.env.JWT_SECRET_TOKEN, {
      expiresIn: "3h",
    });
    res.cookie("token", token);
    req.flash("message", {
      text: "Registered Successfully!!",
      type: "success",
    });
    return res.redirect("/");
  } catch (err) {
    console.log(err.message);
    res.send("Something went wrong!!");
  }
};

const getLogin = async (req, res) => {
  let message = req.flash("message");
  res.render("login", { message });
};

const postLogin = async (req, res) => {
  let { email, password } = req.body;
  if (!email || !password) {
    req.flash("message", { text: "Please enter credentials.", type: "danger" });
    return res.redirect("/users/login");
  }
  try {
    email = email.trim().toLowerCase();
    password = password.trim();
    //Validate Email
    let emailRegex = /^[a-z][a-z0-9._-]*@[a-z0-9._-]+\.[a-z]{2,3}$/gi
    if(!emailRegex.test(email)){
        req.flash('message', {text:'Invalid Email!!', type:'danger'})
        return res.redirect('/users/login')
    }
    //Validate password
    let passwordRegex = /^[^\s]+$/;
    if(!passwordRegex.test(password)){
        req.flash('message', {text:'Password must not contain white spaces in between!!', type:'danger'})
        return res.redirect('/users/login')
    }
    let user = await userModel.findOne({ email: email });
    if (!user) {
      req.flash("message", { text: "User not found!!", type: "danger" });
      return res.redirect("/users/login");
    }
    let result = await bcrypt.compare(password, user.password);
    if (result == true) {
      let token = jwt.sign({ email: email }, process.env.JWT_SECRET_TOKEN, {
        expiresIn: "3h",
      });
      res.cookie("token", token);
      req.flash("message", {
        text: "Logged In Successfully!!",
        type: "success",
      });
      return res.redirect("/");
    } else {
      req.flash("message", { text: "Incorrect Password!!", type: "danger" });
      return res.redirect("/users/login");
    }
  } catch (err) {
    console.log(err.message);
    res.send("Something went wrong!!");
  }
};

const logout = (req, res) => {
  res.clearCookie("token");
  req.flash("message", { text: "Logged Out Successfully!!", type: "success" });
  res.redirect("/users/login");
};

module.exports = { getRegister, postRegister, getLogin, postLogin, logout };
