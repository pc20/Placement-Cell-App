const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// user schema
const userSchama = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// generate hash for the given passowrd
userSchama.statics.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
};
// \check if passowrd is valid
userSchama.statics.validPassword = function (password, user) {
    return bcrypt.compareSync(password, user);
};

const User = mongoose.model("User", userSchama);

module.exports = User;