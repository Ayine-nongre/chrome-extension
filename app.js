const express = require('express')
const cors = require('cors')
const fs = require('fs')
const bodyParser = require('body-parser')
const concat = require('ffmpeg-concat')
const { Readable } = require('stream')
const { spawn } = require('child_process')
const { Deepgram } = require('@deepgram/sdk')

const app = express()

const corsOpts = {
  origin: '*',

  methods: [
    'GET',
    'POST',
  ],

  allowedHeaders: [
    'Content-Type',
  ],
}

app.use(cors(corsOpts))
app.use(express.raw({type: "*/*",  limit: 25 * 1024 * 1024}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const deepgram = new Deepgram(process.env.Auth)

const uploadPath = process.cwd() + "/uploads/"
let id = 10000

app.get("/api/play/:video", (req, res) => {
  const name = req.params.video
  const videoPath = uploadPath + name
  res.sendFile(videoPath)
})

app.get('/api/create', async (req, res) => {
    id = id + 1
    let writable = ''
    try{
        writable = fs.createWriteStream(uploadPath + id + '.mp4')
    }catch(err){
        console.log(err)
        res.status(400).json({ status: "Failed", message: "Failed to create video file"})
    }

    if (writable){
        res.status(200).json({ status: "Success", message: "Video file created successfully", id: id })
    }
})

const arrayBuff = []

app.post('/api/record/:id', async (req, res) => {
    try{
      const filename = req.params.id + '.mp4'
      const buffer = req.body

      if (!Buffer.isBuffer(buffer)){
        res.status(400).json({ status: "Failed", message: "Invalid chunk"})
      }
      arrayBuff.push(buffer)
      res.status(200).json({ status: "Success", message: "Chunk received successfully"})
    }catch(err){
      console.log(err)
      res.status(500).json({ status: "Error", message: "Internal server error"})
    }
})

app.get('/api/video/:id', async (req, res) => {
    const filename = req.params.id + '.mp4'
    if (arrayBuff.length != 0) {
        const complete = Buffer.concat(arrayBuff)
        fs.createWriteStream(uploadPath + filename).write(complete)
    }else{
      console.log("No video chunks")
      res.status(404).json({ status:"Failed", message: "Video chunks not received" })
    }

    const response = await deepgram.transcription.preRecorded(
        { url: "https://extension-64nm.onrender.com/api/play/" + filename },
        { punctuate: true, utterances: true }
    ).catch(err => {
        console.log(err)
        return res.status(400).json({ status: "Failed", message: "Error getting tran"})
    })

  const srtTranscript = response.toSRT();
    
    res.status(200).json({ 
      status: "Success", 
      message: "File uploaded successfully", 
      video_url: "https://extension-64nm.onrender.com/api/play/" + filename,
      "transcript": srtTranscript
    })
})

app.listen(5000 || process.env.PORT, () => {
    console.log("This server is running")
})
