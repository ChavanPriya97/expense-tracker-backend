const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const expenseController = require("../controllers/expenseController");
const { isAuthenticated, isAdmin } = require("../middlewares/auth");



// user register
router.post("/register", userController.register_user);

router.get("/home", (req, res) => {
  return res.send({ status: true, message: "user successfully login" });
});

// user login
router.post("/login", userController.userLogin);

// add expense
router.post("/addExpense", expenseController.addExpense);
//expense list
router.get("/expenseList",expenseController.expenseList);

//get Expense By Id
router.get("/expense/:expenseId", expenseController.getExpenseById);

//update expense
router.put("/updateExpense/:expenseId", expenseController.updateExpense);

// Approve Expense
router.put('/approveExpense/:id',  isAuthenticated, isAdmin,expenseController.approveExpense );

// Reject Expense
router.put('/rejectExpense/:id',  isAuthenticated, isAdmin,expenseController.rejectExpense);

module.exports = router;
