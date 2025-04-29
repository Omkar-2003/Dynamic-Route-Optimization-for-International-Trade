const mongoose = require("mongoose");
const { Schema } = mongoose;
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Define the user schema
const userSchema = new Schema(
  {
    userID: {
      type: String,
      default: uuidv4(),
      required: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: [
        "admin",
        "warehouse_handler",
        "consignee",
        "consignor",
        "driver",
        "technician",
      ],
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      zipCode: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
    },
    extraInfo: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function async() {
  return jwt.sign(
    {
      _id: this._id,
      userID: this.userID,
      email: this.email,
      username: this.username,
      role: this.role,
    },
    "jksdfhkjsdhfkjshdfshdkjfhsdkjfhskjd",
    {
      expiresIn: "2h",
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      userID: this.userID,
    },
    "jdhfjksdhfjksdhfjksdkjfsdjkfsjdkf",
    {
      expiresIn: "3d",
    }
  );
};

// Create the User model
const User = mongoose.model("User", userSchema);

module.exports = User;
