const express = require("express")
const multer = require("multer")
const app = express()

const upload = multer() // files as Buffer

app.use(express.urlencoded())
app.use(express.json())

// GET /hello-world
app.get("/hello-world", (req, res)=> res.status(200).send("Hello world!") )

// POST /name
app.post("/name", (req, res)=>{
    console.log("req.body", req.body)
    const {name} = req.body
    // TODO - apply name...
    return res.status(201).json({todo: "TODO"})
})

// POST /avatar
app.post("/avatar", upload.single("file"), (req, res)=>{
    //console.log("avatar file: ", req.file)
    //console.log("avatar body", req.body)
    const avatar = {
        metadata: req.file, 
        body: req.body
    }
    console.log("avatar", avatar)

    if (avatar.metadata.mimetype == "text/plain") {
        const textContent = avatar.metadata.buffer.toString("utf8")
        console.log("textContent", textContent) // "apple\norange\nbanana"
    }
    // TODO - store file at backend
    // TODO - send file to database
    // TODO - send file to backend - Cloudinary! AWS S3! Firebase -> Google Drive!
    // TODO - send to FTP server (file transfer protocol)

    return res.status(201).json({ok: true})
})

const PORT = 3000
app.listen(PORT, ()=>{
    console.log("Backend server runs at port ", PORT)
})
  