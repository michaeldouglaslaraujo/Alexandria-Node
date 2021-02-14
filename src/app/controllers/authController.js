const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const mailer = require("../../modules/mailer");

const authConfig = require("../../config/auth.json");

const User = require("../models/user");
const Avatar = require("../models/Avatar");
const { use } = require("../../modules/mailer");
const { Console } = require("console");

const router = express.Router();

const Bookcase = require('../models/bookcase');
const Book = require('../models/book');

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 259200,
  });
}

function verifyToken(req) {
  const token = req.headers.authorization;

  var decoded;
  decoded = jwt.verify(token, authConfig.secret);

  if (decoded) {
    return decoded;
  } else {
    return res.status(401).send({ error: "Unauthorized" });
  }
}

//api/user/signup
router.post("/signup", async (req, res) => {
  const { email } = req.body;

  try {
    if (await User.findOne({ email }))
      return res.status(422).send({ error: "User already exists" });

    const user = await User.create(req.body);

    const bookcase = await Bookcase.create({user: user._id});
    console.log(bookcase);

    await bookcase.save();
    console.log(bookcase);

    user.password = undefined;

    return res.send({
      user,
      bookcase,
      token: generateToken({ id: user.id }),
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ error: "Registration failed" });
  }
});

//api/user/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) return res.status(412).send({ error: "User not found" });

  if (!(await bcrypt.compare(password, user.password)))
    return res.status(412).send({ error: "Invalid Password" });

  user.password = undefined;

   const bookcase = await Bookcase.findOne({user: user._id});
   console.log(bookcase);

  const token = res.send({
    user,
    bookcase,
    token: generateToken({ id: user.id }),
  });
});

//api/user/updateuser
router.put("/updateuser/:id", async (req, res) => {
  const { email, password } = req.body;

  const id = req.params.id;
  const userParams = req.body;

  try {
    const user = await User.findByIdAndUpdate(id, userParams);

    if (user) return res.send({ user });
  } catch (err) {
    return res.status(412).send({ error: "Error Updating User" });
  }
});

//api/user/getuser
router.get("/getuser", async (req, res) => {
  const decoded = verifyToken(req);

  try {
    var id = decoded.id;
    const user = await User.findOne({ _id: id });

    const bookcase = await Bookcase.findOne({user: user._id});
    console.log(bookcase);
 
    if (user) return res.send({ user, bookcase });
  } catch (err) {
    return res.status(412).send({ error: "Error Loading User" });
  }
  //retorne os dados do usuarios com esse token ativo
  //busco o token no banco
  //trato o erro caso ele não tenha sido localizado (Erro 422, usuário deslogado)
  //achando o token retorno (do Objeto Usuário - JSON)
});

// /api/user/forgotPassword
router.post("/forgotpassword", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(412).send({ error: "User not found" });

    const token = crypto.randomBytes(20).toString("hex");

    const now = new Date();
    now.setHours(now.getHours() + 1);

    await User.findByIdAndUpdate(
      user.id,
      {
        $set: {
          passwordResetToken: token,
          passwordResetExpires: now,
        },
      },
      { new: true, useFindAndModify: false }
    );

    mailer.sendMail(
      {
        to: email,
        from: "mike_avril@hotmail.com",
        template: "auth/forgot_password",
        context: { token, email },
      },
      (err) => {
        if (err)
          return res
            .status(400)
            .send({ error: "Cannot send forgot password email" });

        return res.send();
      }
    );
  } catch (err) {
    res.status(400).send({ error: "Error on forgot password, try again " });
  }
});

// /api/user/newPassword
router.post("/newpassword", async (req, res) => {
  const { email, token, password } = req.body;

  try {
    const user = await User.findOne({ email }).select(
      "+passwordResetToken passwordResetExpires"
    );

    if (!user) return res.status(412).send({ error: "User not found" });

    if (token !== user.passwordResetToken)
      return res.status(412).send({ error: "Token invalid" });

    const now = new Date();

    if (now > user.passwordResetExpires)
      return res
        .status(412)
        .send({ error: "Token expired, generate a new one" });

    user.password = password;

    await user.save();

    res.send({
      user,
      token: generateToken({ id: user.id }),
    });
  } catch (err) {
    res.status(400).send({ error: "Error on forgot password, try again " });
  }
});

//api/user/avatar/list
router.get("/avatar/list", async (req, res) => {
  try {
    const query = Avatar.find({});
    const avatar = await query.exec();

    return res.send(avatar);
  } catch (err) {
    console.log(err);
    return res.status(412).send({ error: "Error Avatar List" });
  }
  //return array com objeto avatar
});

module.exports = (app) => app.use("/api/user", router);
