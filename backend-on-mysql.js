const express = require("express")
const mysql = require("mysql2")
const bcrypt = require("bcrypt")
const app = express()

app.use(express.json())

const saltRounds = 10

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

                bcrypt.hash(password, saltRounds, (error3, hash)=>{
                    if (error3) {
                        console.warn(error3)
                        return res.status(500).json({error: error3})
                    } else {
                        conn.query(sql2, [name, email, hash], (error2, result2, fields2)=>{
                            if (error2) {
                                console.warn(`POST /users error: `+error2.message)
                                return res.status(500).json({error: error2})
                            } else {
                                return res.status(201).json({result: result2})
                            }
                        })
                    }
                })


            }
        }
    })
})

/**
 * PUT /users/:id
 */
app.put("/users/:id", (req, res)=>{
    const {id} = req.params
    if (+id <= 1) {
        return res.status(403).json({error: "Don't touch admin id=1 !"})
    }

    const {name, email, password} = req.body
    if (!name && !email && !password) {
        const message = `No data to update with!`
        console.warn(message)
        return res.status(400).json({error: message})
    } else {
        const fieldParams = []
        let fieldValues = []
        if (name) {
            fieldParams.push(`name=?`)
            fieldValues.push(name)
        }
        if (email) {
            fieldParams.push(`email=?`)
            fieldValues.push(email)
        }
        if (password) {
            fieldParams.push(`password=?`)
            fieldValues.push(password)
        }
        fieldValues = [...fieldValues, +id]
        const sql = `UPDATE users SET ${fieldParams.join(',')} WHERE id=?`
        console.log("fieldParams", fieldParams)
        console.log("fieldValues", fieldValues)
        console.log("UPDATE SET sql: ", sql)

        conn.query(sql, fieldValues, (error, result, fields)=>{
            if (error) {
                console.warn(error)
                return res.status(500).json({error})
            } else {
                const resultWithId = {...result, id: +id }
                return res.status(200).json({result: resultWithId})
            }
        })

        //return res.status(200).json({todo: "TODO"})
    }
})

/**
 * DELETE /users/:id
 */
app.delete("/users/:id", (req, res)=>{
    const {id} = req.params
    if (+id <= 1) {
        return res.status(403).json({error: "Don't touch admin id=1 !"})
    }

    const sql = "DELETE FROM users WHERE id = ?"
    conn.query(sql, [id], (error, result, fields)=>{
        if (error) {
            console.warn(error)
            return res.status(500).json({error})
        } else {
            return res.status(200).json({result})
        }
    })
})

const PORT = 3000
app.listen(PORT, ()=>{
    console.log("Backend server runs on port ", PORT)
})