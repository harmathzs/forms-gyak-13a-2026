const express = require("express")
const mysql = require("mysql2")
const app = express()

app.use(express.json())

const conn = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "users"
})
conn.connect(err => {
    if (err) {
        console.warn("Can't connect to MySQL database! Error: ", err.message)
    } else {
        console.log("Connected to MySQL.")
    }
})

/**
 * GET /users
 */
app.get("/users", (req, res)=>{
    const sql = "SELECT id, name, email FROM users"
    conn.query(sql, (error, result, fields)=>{
        if (error) {
            console.warn("GET /users error: "+error.message)
            return res.status(500).json({error})
        } else {
            return res.status(200).json({result, fields})
        }
    })
})

/**
 * GET /users/:id
 */
app.get("/users/:id", (req, res)=>{
    const {id} = req.params

    const sql = `SELECT id, name, email FROM users WHERE id = ?`
    conn.query(sql, [+id], (error, result, fields)=>{
        if (error) {
            console.warn(`GET /users/${id} error: `+error.message)
            return res.status(500).json({error})
        } else {
            return res.status(200).json({result, fields})
        }
    })
})

const PORT = 3000
app.listen(PORT, ()=>{
    console.log("Backend server runs on port ", PORT)
})