const jwt = require("jsonwebtoken");
const dbConnect = require("../DbConnect/sqlConnect");

const createExpense = async (req, res) => {
  const { amount, description, categories, date } = req.body;
  const sql =
    "INSERT INTO Expense (user_id,amount,description,categories,date) VALUES (?,?,?,?,?)";

  try {
    const db = await dbConnect();
    const [expense] = await db.query(sql, [
      req.userId,
      amount,
      description,
      categories,
      date,
    ]);
    console.log("User Id", expense.insertId);
    res.status(201).json({
      message: "Expense added",
      //expenseId:expense.insertId,
      user_id: expense.insertId,
      amount,
      description,
      categories,
      date,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating new expenses",
      error: error.message,
    });
  }
};

const getAllExpense = async (req, res) => {
  const sql = "SELECT * FROM Expense";

  try {
    const db = await dbConnect();
    const [result] = await db.execute(sql);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSingleExpense = async (req, res) => {
  const sql = "SELECT * FROM Expense WHERE id = ?";

  try {
    const db = await dbConnect();
    const [result] = await db.query(sql, [req.params.id]);
    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "No expenses with provided Id was found" });
    }
    res.status(200).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateExpense = async (req, res) => {
  const { amount, description, categories } = req.body;
  const sql =
    "UPDATE Expense SET amount = ?,description = ?, categories = ?,updated_at = CURRENT_TIMESTAMP WHERE id = ?";

  try {
    const db = await dbConnect();
    const [update] = await db.query(sql, [
      amount,
      description,
      categories,
      req.params.id,   
    ]);

    if (update.affectedRows === 0) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.status(200).json({
      message:"Expenses updated successfully",
      user_id:update.insertId,
      amount,description,categories
    });
  } catch (error) {
    res.status(500).json({
      message: "Error update expenses",
      error: error.message,
    });
  }
};

const filterExpenses = async (req, res) => {
  const { period, start_date, end_date } = req.query;
  const userId = req.userId; //Gotten from JWT middleware
  let sql = "SELECT * FROM Expense WHERE user_id = ?";
  const queryParams = [userId];

  try {
    //Handle the defined time filters
    if (period) {
      let dateCondition;
      const today = new Date();

      if (period === "last_week") {
        dateCondition = new Date(today.setDate(today.getDate() - 7));
      } else if (period === "last_month") {
        dateCondition = new Date(today.setMonth(today.getMonth() - 1));
      } else if (period === "last_3_month") {
        dateCondition = new Date(today.setMonth(today.getMonth() - 3));
      }

      if (dateCondition) {
        sql += " AND created_at >= ?";
        queryParams.push(dateCondition.toISOString().split("T")[0]);
      }
    }

    //Handle custome date range
    if (start_date && end_date) {
      sql += "AND created_at BETWEEN ? AND ?";
      queryParams.push(start_date, end_date);
    } else if (start_date) {
      sql += "AND created_at >= ?";
      queryParams.push(start_date);
    } else if (end_date) {
      sql += "AND created_at <= ?";
      queryParams.push(end_date);
    }

    //Execute the query
    const db = await dbConnect();
    const [expenses] = await db.query(sql, queryParams);

    res.status(200).json({
      message: "Expenses retrieved successfully",
      expenses,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching expenses",
      error: error.message,
    });
  }
};

module.exports = {
   createExpense,
   getAllExpense,
   getSingleExpense,
   updateExpense,
   filterExpenses
};
