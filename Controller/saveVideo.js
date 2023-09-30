const fs = require('fs')
const { writable } = require('./createVideo')

exports.saveUpload = async (req, res) => {
    const chunk = req.body

    writable.write(chunk, (err, data) => {
        if (err){
            console.log(err)
        }
        console.log("Chunk...")
    });
}