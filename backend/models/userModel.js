const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    role: {
        type: String,
        enum: ['guest', 'admin'], // Define roles as guest or admin
    }
});

// static signup method
userSchema.statics.signup = async function(email, password, firstName, lastName, phoneNumber, role) {
    // Validation
    if (!email || !password) {
        throw Error("Email and password are required");
    }
    if (!validator.isEmail(email)) {
        throw Error("Invalid email format");
    }
    if (!validator.isStrongPassword(password)) {
        throw Error("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character");
    }

    const exists = await this.findOne({ email });

    if (exists) {
        throw Error("Email already in use");
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await this.create({ email, password: hash, firstName, lastName, phoneNumber, role });

    return user;
};

// static login method
userSchema.statics.login = async function(email, password) {
    if (!email || !password) {
        throw Error("Email and password are required");
    }

    const user = await this.findOne({ email });
    if (!user) {
        throw Error("Incorrect email or password");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw Error("Incorrect email or password");
    }

    return user;
};

module.exports = mongoose.model("User", userSchema);
