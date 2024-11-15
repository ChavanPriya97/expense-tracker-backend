// const jwt = require("jsonwebtoken");
// const expenseModel = require("../models/expenseModel");
// let decodedtoken;

// exports.authenticate = function (req, res, next) {
//   try {
//     let token = req.headers["x-api-key"] || req.headers["X-Api-Key"];
//     if (!token)
//       return res.status(400).send({ status: false, message: "Token must be present" });

//     decodedtoken = jwt.verify(token, "expense-mgmt", function (err, token) {
//       if (err) {
//         return res.status(401).send({ status: false, message: err.message });
//       } else {
//         return token;
//       }
//     });
//     req.tokenId = decodedtoken.userId;  // Set the userId in req.tokenId
//     next();
//   } catch (error) {
//     res.status(500).send({ status: false, message: error.message });
//   }
// };



// exports.authorisation = async function (req, res, next) {
//   let expenseId = req.params.expenseId;
//   if (!expenseId)
//     return res
//       .status(400)
//       .send({ status: false, message: "please provide the expenseId" });
//   let expense = await expenseModel.findById(expenseId);
//   if (!expense)
//     return res
//       .status(400)
//       .send({ status: false, message: "this expense is not exists" });
//   let userid = expense.userId;
//   let userId = req.tokenId;
//   if (userid != userId)
//     return res
//       .status(400)
//       .send({ status: false, message: "unauthorised user!" });
//   next();
// };




const jwt = require("jsonwebtoken");
const Expense = require("../models/expenseModel"); 
const User = require("../models/userModel"); 


// Middleware to authenticate user using JWT token
const isAuthenticated = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, "expense-mgmt");
    req.user = await User.findById(decoded.userId);
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

module.exports ={isAuthenticated , isAdmin}
