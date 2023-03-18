import { mongoose } from "mongoose";

const { Schema } = mongoose;

const etcOptionSchema = new Schema(
  {
    parent: {
      type: String,
      required: true,
    },
    texts: {
      type: Array,
      default: [],
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

export default mongoose.model("EtcOption", etcOptionSchema);
