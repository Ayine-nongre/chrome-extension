const fs = require('fs')

let id = 10000
const uploadPath = process.cwd() + '/../uploads/' + id + '.mp4'

exports.createVideo = async (req, res) => {
    id = id + 1
    exports.writable = await fs.createWriteStream(uploadPath).catch(err => {
        console.log(err)
        return res.status(400).json({ status: "Failed", message: "Failed to create video file"})
    })

    if (writable){
        res.status(200).json({ status: "Success", message: "Video file created successfully", id: id })
    }
}
