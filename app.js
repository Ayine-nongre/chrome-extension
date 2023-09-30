const express = require('express')
const cors = require('cors')
const { createVideo } = require('./Controller/createVideo')
const { saveUpload } = require('./Controller/saveVideo')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/api/create', createVideo)

app.get('/api/save', saveUpload)

app.listen(3000 || process.env.PORT, () => {
    console.log("Server is running")
})
