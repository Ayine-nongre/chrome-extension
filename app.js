const express = require('express')
const cors = require('cors')
const fs = require('fs')


const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin',req.header('Origin'));
    res.removeHeader('x-powered-by');
    res.setHeader('Access-Control-Allow-Methods',req.method);
    res.setHeader('Access-Control-Allow-Headers','Content-Type');
    next();
  })

const uploadPath = process.cwd() + "/uploads/"
let id = 10000

app.get('/api/create', async (req, res) => {
    id = id + 1
    let writable = ''
    try{
        writable = await fs.createWriteStream(uploadPath + '10001.mp4')
    }catch(err){
        console.log(err)
        res.status(400).json({ status: "Failed", message: "Failed to create video file"})
    }

    if (writable){
        res.status(200).json({ status: "Success", message: "Video file created successfully", id: 10001 })
        console.log(id)
    }
})


app.listen(3000 || process.env.PORT, () => {
    console.log("Server is running")
})
