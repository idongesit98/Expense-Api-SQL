const express = require('express');
const {createExpense, getAllExpense, getSingleExpense, updateExpense, filterExpenses,} = require('../Controller/expenseController');
const authenticate = require('../DbConnect/Middleware/authenticate');
const router = express.Router();

router.post("/create-expense",authenticate,createExpense);
router.get("/get-expenses", authenticate, getAllExpense);
router.get("/single-expense/:id",authenticate,getSingleExpense);
router.put("/update-expense/:id",authenticate, updateExpense);
router.get("/filter",authenticate,filterExpenses);

module.exports = router;