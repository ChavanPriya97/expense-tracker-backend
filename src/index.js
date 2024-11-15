const express = require("express");
const mongoose = require("mongoose");
const route = require("./routes/route");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://priya971110:admin@cluster0.2cltl.mongodb.net/ExpenseTraker"
  )
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((errors) => {
    console.log(errors.message);
  });

app.use("/", route);

app.get("/getData", (req, res) => {
  console.log("application run successfully");
  return res.send("Application run successfully");
});

app.listen(process.env.PORT || 5000, function () {
  console.log("express running on PORT " + (process.env.PORT || 5000));
});
