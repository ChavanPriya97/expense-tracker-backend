const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

// Helper function to format the date
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const expenseSchema = new mongoose.Schema(
  {
    expenseName: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      get: (date) => formatDate(date),
    },
    description: {
      type: String,
      required: true,
    },
    userId: {
      type: ObjectId,
      ref: "User",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    rejectionReason: {
      type: String,
      default: "",
    },
  },

  { timestamps: true, toJSON: { getters: true }, toObject: { getters: true } }
);

module.exports = mongoose.model("Expense", expenseSchema);
