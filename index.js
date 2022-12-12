import "dotenv/config";
import express from 'express';
import http from 'http';
import path from 'path'

import { connectSocket } from './src/socket.js'
import { connectDB } from './src/database/connect.js';

const app = express()
const server = http.createServer(app)
const __dirname = path.resolve()
const PORT = process.env.PORT

app.use(express.static(path.join(__dirname, "..", "frontend", "build")))

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "frontend", "build", "index.html"))
})

connectSocket(server)
connectDB()

server.listen(PORT, () => {
    console.log(`${PORT} 포트 연결 완료`);
})