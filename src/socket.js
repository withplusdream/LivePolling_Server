import { Server } from "socket.io";

import { adminLogin } from "./controllers/api.js";
import {
  createProject,
  getProject,
  modifyProject,
  getProjectsByAdmin,
  deletePolls,
  checkAccessCode,
  getProjectById,
  submitWord,
  submitOption,
  submitEtc,
  getWords,
  resetSlide,
  getOptionsById,
} from "./database/controller/control.js";

export let io = undefined;

export const connectSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        "*",
        "http://localhost:3000",
        "https://admin.socket.io",
        "http://192.168.0.50:3000",
        "http://172.30.1.39:3000",
        "http://localhost",
      ],
      methods: ["GET", "POST"],
      credentials: true,
      transports: ["websocket"],
    },
  });

  io.on("connection", (socket) => {
    console.log("socket connected");

    socket.on("adminLogin", async (data) => {
      const res = await adminLogin(data);

      socket.emit("adminLogin", res);
    });

    socket.on("createProject", async (data) => {
      let project = await createProject(data);
      socket.emit("createProject", project);
    });

    socket.on("getProject", async (data) => {
      let project = await getProject(data);

      socket.emit("getProject", project);
    });

    socket.on("modifyProject", async (data) => {
      let res = await modifyProject(data);

      socket.emit("modifyProject", res);
    });

    socket.on("getProjectsByAdmin", async (data) => {
      let projects = await getProjectsByAdmin(data.admin);

      socket.emit("getProjectsByAdmin", projects);
    });

    socket.on("deletePolls", async (data) => {
      let errorDetected = await deletePolls(data.ids);

      if (errorDetected) {
        socket.emit("deletePolls", { success: false });
      } else {
        socket.emit("deletePolls", { success: true });
      }
    });

    socket.on("accessPoll", async (data) => {
      let res = await checkAccessCode(data.accessCode);

      socket.emit("accessPoll", res);
    });

    socket.on("getProjectById", async (data) => {
      let res = await getProjectById(data.id);

      socket.emit("getProjectById", res);
    });

    socket.on("getOptionsById", async (data) => {
      let res = await getOptionsById(data.id);

      socket.emit("getOptionsById", res);
    });

    socket.on("submitWord", async (data) => {
      io.to(data.id).emit("sendWord", { text: data.text });
      let project = await submitWord(data);

      socket.emit("submitWord", { overlap: project.data.overlap, project: project });
    });

    socket.on("submitOption", async (data) => {
      // for (var i = 0; i < data.votes.length; i++) {
      // if (data.text === "기타") {
      //   io.to(data.id).emit("sendEtcContent", { content: data.content });
      // }
      let project = await submitOption(data);
      // }
      socket.emit("submitOption", project);
      let res = await getOptionsById(data.id);
      io.to(data.id).emit("getOptionsById", res);
    });

    socket.on("submitEtc", async (data) => {
      let res = await submitEtc(data);

      socket.emit("submitEtc", res);

      res = await getOptionsById(data.id);
      io.to(data.id).emit("getOptionsById", res);
    });

    socket.on("joinRoom", (data) => {
      socket.join(data.id);
    });

    socket.on("getWords", async (data) => {
      let words = await getWords(data.id);
      socket.emit("getWords", { words: words });
    });

    socket.on("resetSlide", async (data) => {
      let res = await resetSlide(data.id);

      socket.emit("resetSlide", res);
    });
  });
};
