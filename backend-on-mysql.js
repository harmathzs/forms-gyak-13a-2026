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
            return res.status(200).json({result})
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
            return res.status(200).json({result}) 
        }
    })
})

/**
 * POST /users
 */
app.post("/users", (req, res)=>{
    const {name, email, password} = req.body
    const sql1 = "SELECT id, name, email FROM users"
    conn.query(sql1, (error1, result1, fields1)=>{
        if (error1) {
            console.warn(`POST /users error: `+error1.message)
            return res.status(500).json({error: error1})            
        } else {
            console.log("result1", result1)

            const found = result1.find( user => user.email == email )
            console.log("found", found)

            if (found) {
                console.warn(`Existing user wants to re-register? ${found.email}`)
                return res.status(409).json({error: `Existing user wants to re-register? ${found.email}`})
            } else {
                const sql2 = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`
                conn.query(sql2, [name, email, password], (error2, result2, fields2)=>{
                    if (error2) {
                        console.warn(`POST /users error: `+error2.message)
                        return res.status(500).json({error: error2})
                    } else {
                        return res.status(201).json({result: result2})
                    }
                })
            }
        }
    })
})

const PORT = 3000
app.listen(PORT, ()=>{
    console.log("Backend server runs on port ", PORT)
})