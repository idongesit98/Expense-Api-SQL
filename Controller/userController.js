const dbConnect = require("../DbConnect/sqlConnect");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");

const createUser = async (req,res) => {
    const {name,email,password} = req.body;
    const sql = `INSERT INTO Users (name,email,password) VALUES(?,?,?)`;
    const hashedPassword = await bcrypt.hash(password,10);
           
    try {
       const db = await dbConnect();
       const [user] = await db.execute(sql,[name,email,hashedPassword]);
        res.status(201).json({
            id:user.insertId,
            name,
            email,
            password:hashedPassword
        })
    } catch (error) {
       res.status(500).json(
        {message:"Error registering new user",
             error:error.message
        });
    }
}

const loginUser = async(req,res) => {
    const {email,password} = req.body;
    const sql = `SELECT * FROM Users WHERE email = ?`;
    const db = await dbConnect();

    const [users] = await db.query(sql,[email]);
    if (users.length === 0 || !(await bcrypt.compare(password,users[0].password))) {
        return res.status(401).json({message: "Invalid credentials"})
    }

    const token = jwt.sign({userId: users[0].id}, 'plasmodiumfalciparumfemaleanophelesmosquito',{expiresIn:'1hr'});
    res.json({token});
}

const getAllUser = async(req,res) => {
    const sql = `SELECT * FROM expense_db.Users`;
    try {
        const db = await dbConnect()
        const [results] = await db.execute(sql);
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}

const getSingleUser = async(req,res) => {
    const sql = `SELECT * FROM expense_db.Users WHERE id = ?`;

    try {
        const db = await dbConnect();
        const [results] =  await db.execute(sql,[req.params.id]);
        
        if (results.length === 0) {
            return res.status(404).json({message:"User not found"});
        }
        res.status(200).json(results[0])
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

const deleteUser = async(req,res) =>{
    const sql = `DELETE FROM expense_db.Users WHERE id = ?`;
    try {
        const db = await dbConnect();
        const results = await db.query(sql,[req.params.id]);
        if (results.affectedRows === 0) {
            return res.status(404).json({message:"User not found"});
        }
        res.status(200).json({message:"User deleted"})
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}

module.exports = {
    createUser,
    loginUser,
    getAllUser,
    getSingleUser,
    deleteUser
}
