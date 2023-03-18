import { mongoose } from "mongoose";

const { Schema } = mongoose;

const wordSchema = new Schema(
  {
    parent: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      default: 1,
    },
  },
  {
    versionKey: false,
  }
);

export default mongoose.model("Word", wordSchema);
