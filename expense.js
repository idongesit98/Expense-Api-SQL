const express = require('express');
const dbConnect = require('./DbConnect/sqlConnect');
const userRoute = require('./Router/userRouter');
const expenseRouter = require("./Router/expenseRouter");
const morgan = require('morgan');
const PORT = 8080;
const app = express();

dbConnect();
app.use(express.json());
app.use(morgan('tiny'));

app.use("/api/expense",userRoute)
app.use("/api",expenseRouter)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})