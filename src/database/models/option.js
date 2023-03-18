import { mongoose } from "mongoose";

const { Schema } = mongoose;

const optionSchema = new Schema(
  {
    parent: {
      type: String,
      required: true,
    },
    option: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      default: 0,
    },
  },
  {
    versionKey: false,
  }
);

export default mongoose.model("Option", optionSchema);
