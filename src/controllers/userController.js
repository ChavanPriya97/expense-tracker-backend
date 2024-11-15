const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// User Registration
const register_user = async function (req, res) {
  try {
    let data = req.body;
    const { userName, password, email, fullName } = data;

    // Check if data is present in the body
    if (Object.keys(data).length === 0) {
      return res
        .status(400)
        .send({ success: false, message: "Data not found in body" });
    }

    // Validations for required fields
    if (!userName)
      return res
        .status(400)
        .send({ success: false, message: "Username is required" });
    if (!password)
      return res
        .status(400)
        .send({ success: false, message: "Password is required" });
    if (!email)
      return res
        .status(400)
        .send({ success: false, message: "Email is required" });
    if (!fullName)
      return res
        .status(400)
        .send({ success: false, message: "Full name is required" });

    //uniueness email

    const userEmail = await userModel.findOne({ email: email });

    if (userEmail)
      return res
        .status(400)
        .send({ success: false, message: "User is already register" });

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    data.password = hashedPassword;

    // Create user in the database
    const user = await userModel.create(data);

    return res.status(201).send({
      success: true,
      data: user,
      message: "User created successfully",
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

// User Login
const userLogin = async function (req, res) {
  try {
    const data = req.body;
    const { email, password } = data;

    if (Object.keys(data).length === 0) {
      return res
        .status(400)
        .send({ status: false, message: "Data not found in body" });
    }

    if (!email)
      return res
        .status(400)
        .send({ status: false, message: "Email is required" });
    if (!password)
      return res
        .status(400)
        .send({ status: false, message: "Password is required" });

    // Check if the user exists
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(400).send({
        status: false,
        message: "Account not found. Please register first.",
      });
    }

    // Validate password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .send({ status: false, message: "Invalid Email or Password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id  }, 
      "expense-mgmt", 
      {expiresIn: "1h",}
    );
    res.setHeader("x-api-key", token);

    return res.status(200).send({
      success: true,
      message: "Login successful",
      token: token,
      user: {
        userName: user.userName,
        role: user.role
      }
    });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};



module.exports = {
  register_user,
  userLogin,
};
