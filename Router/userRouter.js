const express = require("express");
const { getSingleUser, getAllUser, createUser, deleteUser, loginUser } = require("../Controller/userController");
const router = express.Router();

router.get("/users", getAllUser);
router.get("/single-user/:id", getSingleUser);
router.post("/register",createUser);
router.post("/login",loginUser);
router.delete("/delete-user/:id", deleteUser);

module.exports = router;