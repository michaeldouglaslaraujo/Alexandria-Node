const mongoose = require("../../database");
const bcrypt = require("bcryptjs");

const AvatarSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    literary_genre: {
      type: String,
      require: true,
    },
    image: {
      type: String,
      require: true,
    },
  },
  { collection: "avatar" }
);

const Avatar = mongoose.model("Avatar", AvatarSchema);

module.exports = Avatar;
