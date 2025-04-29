const { asyncHandler } = require("../utils/asyncHandler.js");
const { ApiResponse } = require("../utils/ApiResponse.js");
const { ApiError } = require("../utils/ApiError.js");
const User = require("../models/User.js");

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, role, phoneNumber, address } = req.body;
  console.log(req.body);

  // Check if all required fields are provided
  if (!username || !password || !role || !phoneNumber || !address) {
    throw new ApiError(400, "All fields are required.");
  }

  // Check for existing user with the same username
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    throw new ApiError(401, "Username already exists.");
  }

  // Create new user document
  const newUser = new User({
    username,
    email,
    password,
    role,
    phoneNumber,
    address,
  });

  // Save new user document to the database
  await newUser.save();

  // Return response with the new user details
  res
    .status(201)
    .json(new ApiResponse(201, newUser, "User registered successfully."));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({
    email,
  });

  if (!user) {
    throw new ApiError(404, "user does not exists.");
  }

  const isPasswordValid = user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "user Logged In Successfully."
      )
    );
});

module.exports = {
  registerUser,
  loginUser,
};
