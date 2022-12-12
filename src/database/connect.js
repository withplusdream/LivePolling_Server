import mongoose from "mongoose";

// * Mongo DB 연결 함수
export const connectDB = () => {
    mongoose.connect(
      process.env.DB_URL,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      (err) => {
        if (err) {
          console.log("몽고디비 연결 에러", error);
        }
      }
    );
}
connectDB();

const db = mongoose.connection;

const handleOpen = () => console.log("✅ Connected to DB");
const handleError = (error) => console.log("❌ DB  can not connect", error);

db.once("open", handleOpen);
db.on("error", handleError);

mongoose.connection.on("disconnected", () => {
    console.error("Database Disconnected, so we try to connect again");
    connectDB();
});