import {Server} from 'socket.io'

import { adminLogin } from './controllers/api.js';
import { 
    createProject, getProject, modifyProject, getProjectsByAdmin, deletePolls, checkAccessCode, getProjectById, submitAnswer, getWords,
    resetSlide 
} from './database/controller/control.js';

export let io = undefined;

export const connectSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: ["*","http://localhost:3000", "https://admin.socket.io", "http://192.168.0.60:3000", "http://172.30.1.39:3000", "http://localhost"],
            methods: ["GET", "POST"],
            credentials: true,
            transports: ['websocket']
        }
    })

    io.on("connection", (socket) => {
        console.log("socket connected");

        socket.on("adminLogin", async (data) => {
            const res = await adminLogin(data)
            
            socket.emit("adminLogin", res)
        })

        socket.on("createProject", async (data) => {
            let project = await createProject(data)
            socket.emit("createProject", project)
        })

        socket.on("getProject", async (data) => {
            let project = await getProject(data)
            
            socket.emit("getProject", project)
        })

        socket.on("modifyProject", async (data) => {
            let res = await modifyProject(data)

            socket.emit("modifyProject", res)
        })

        socket.on("getProjectsByAdmin", async (data) => {
            let projects = await getProjectsByAdmin(data.admin)

            socket.emit("getProjectsByAdmin", projects)
        })

        socket.on("deletePolls", async (data) => {
            let errorDetected = await deletePolls(data.ids)

            if(errorDetected){
                socket.emit("deletePolls", {success: false})
            }
            else{
                socket.emit("deletePolls", {success: true})
            }
        })

        socket.on("accessPoll", async (data) => {
            let res = await checkAccessCode(data.accessCode)

            socket.emit("accessPoll", res)
        })

        socket.on("getProjectById", async (data) => {
            let res = await getProjectById(data.id)

            socket.emit("getProjectById", res)
        })

        socket.on("submitAnswer", async (data) => {
            io.to(data.id).emit("sendWord", {text: data.text})
            let project = await submitAnswer(data)
            
            socket.emit("submitAnswer", {overlap: project.data.overlap})
        })

        socket.on("joinRoom", (data) => {
            socket.join(data.id)
        })

        socket.on("getWords", async (data) => {
            let words = await getWords(data.id)
            socket.emit("getWords", {words: words})
        })

        socket.on("resetSlide", async (data) => {
            let res = await resetSlide(data.id)

            socket.emit("resetSlide", res)
        })
    })
}

