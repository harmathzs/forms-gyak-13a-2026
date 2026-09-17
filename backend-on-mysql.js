const express = require("express")
const mysql = require("mysql2")
const app = express()

app.use(express.json())



const PORT = 3000
app.listen(PORT, ()=>{
    console.log("Backend server runs on port ", PORT)
})