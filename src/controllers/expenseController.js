const expenseModel = require("../models/expenseModel");

/*****************Create Expense *********************/
const addExpense = async (req, res) => {
  try {
    const { expenseName, amount, date, description } = req.body;

    if (!expenseName || !amount || !date || !description) {
      return res
        .status(400)
        .send({ success: false, message: "All fields are required" });
    }

    const existingExpense = await expenseModel.findOne({
      expenseName,
      amount,
      description,
    });

    if (existingExpense)
      return res
        .status(400)
        .send({ success: false, message: "This expense is already created" });

    const expense = await expenseModel.create({
      expenseName,
      amount,
      date,
      description,
      userId: req.tokenId,
    });

    return res.status(201).send({
      success: true,
      message: "Expense Added Successfully",
      redirectTo: "/expenseList", 
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

// get expense list
const expenseList = async function (req, res) {
  try {
    let queries = req.query;
    let result = { isDeleted: false, ...queries };

    if (!Object.keys(queries).length) {
      const data = await expenseModel.find({ isDeleted: false });

      if (!data.length) {
        return res
          .status(404)
          .send({ status: false, message: "Expense not found" });
      }
      return res.status(200).send({ status: true, data });
    } else {
      const data = await expenseModel.find(result).select({
        expenseName: 1,
        amount: 1,
        date: 1,
        description: 1,
        userId: 1,
      });

      if (!data.length) {
        return res
          .status(404)
          .send({ status: false, message: "Expense not found" });
      }

      return res
        .status(200)
        .send({ status: true, message: "Expense list", data });
    }
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};


const getExpenseById = async function (req, res) {
  try {
    const { expenseId } = req.params;

    // Check if expenseId is provided
    if (!expenseId) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide an expenseId" });
    }

    // Fetch the expense from the database
    const expense = await expenseModel.findById(expenseId).select({
      expenseName: 1,
      amount: 1,
      date: 1,
      description: 1,
      userId: 1,
    });

    // If expense is not found
    if (!expense) {
      return res
        .status(404)
        .send({ status: false, message: "Expense not found" });
    }

    // Return the fetched expense data
    return res.status(200).send({
      status: true,
      message: "Expense fetched successfully",
      data: expense,
    });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

// update expense
const updateExpense = async function (req, res) {
  try {
    const data = req.body;

    if (Object.keys(data).length === 0) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide data" });
    }

    const expenseId = req.params.expenseId;
    if (!expenseId) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide expenseId" });
    }

    const expenseDetails = await expenseModel.findById(expenseId);
    if (!expenseDetails) {
      return res
        .status(404)
        .send({ status: false, message: "Expense not found" });
    }

    const updatedData = await expenseModel.findOneAndUpdate(
      { _id: expenseId },
      data,
      { new: true }
    );

    return res.status(200).send({
      status: true,
      message: "Successfully updated",
      data: updatedData,
      redirectTo: "/expenseList", // Provide the redirect URL
    });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

const approveExpense = async function (req, res) {
  try {
    const expenseId = req.params.id;
    const expense = await expenseModel.findById(expenseId);

    if (!expense) {
      return res.status(404).send({ message: "Expense not found" });
    }

    if (expense.status === "Approved") {
      return res.status(400).send({ message: "Expense already approved" });
    }

    expense.status = "Approved";
    await expense.save();

    return res
      .status(200)
      .send({
        success: true,
        message: "Expense approved successfully",
        expense,
      });
  } catch (error) {
    console.error("Error approving expense:", error);
    return res.status(500).send({ success: false, message: "Server error" });
  }
};

const rejectExpense = async function (req, res) {
  try {
    const expenseId = req.params.id;
    const expense = await expenseModel.findById(expenseId);

    if (!expense) {
      return res
        .status(404)
        .send({ success: false, message: "Expense not found" });
    }

    if (expense.status === "Rejected") {
      return res
        .status(400)
        .send({ success: false, message: "Expense already rejected" });
    }

    expense.status = "Rejected";

    await expense.save();

    return res
      .status(200)
      .send({
        success: true,
        message: "Expense rejected successfully",
        expense,
      });
  } catch (error) {
    console.error("Error rejecting expense:", error);
    return res.status(500).send({ success: false, message: "Server error" });
  }
};

module.exports = {
  addExpense,
  expenseList,
  updateExpense,
  getExpenseById,
  approveExpense,
  rejectExpense,
};
