const mongoose = require("../../database");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    unique: true,
    require: true,
    lowercase: true,
  },
  cpf: {
    type: String,
    require: true,
  },
  birthdate: {
    type: Date,
    require: true,
  },
  gender: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  passwordResetToken: {
    type: String,
    select: false,
  },
  passwordResetExpires: {
    type: Date,
    select: false,
  },
  avatarId: {
    type: String,
    ref: "Avatar",
    select: true,
  },
  bookcaseId:{
    type: String,
    ref:"Bookcase",
    select: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre("save", async function (next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;

  next();
});

const User = mongoose.model("user", UserSchema);

module.exports = User;
