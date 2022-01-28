const express = require("express");
// const { sendFile } = require('express/lib/response')
// const { sendFile } = require('express/lib/response')
const app = express();
const fs = require("fs");

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/video", (req, res) => {
    console.log("hi");
    const range = req.headers.range;
    if (!range) {
        res.status(400).send("requires header of range");
    }
    console.log(range);
    const videoPath = "video2.mp4";
    const videoSize = fs.statSync("video2.mp4").size;
    // console.log(videoSize);
    const CHUNK_SIZE = 10 ** 6;

    const start = Number(range.replace(/\D/g, ""));
    // const start =0;
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    };
    res.writeHead(206, headers);
    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.pipe(res);
});

app.listen(8000, () => {
    console.log("Listening at 8000");
});
