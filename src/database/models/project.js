import { mongoose } from 'mongoose';

const { Schema } = mongoose;

const projectSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    admin: {
        type: String,
        required: true
    },
    accessCode : {
        type: Number,
        required: true,
        unique: true
    },
    type: {
        type: String,
    },
    data: {
        type: Object
    },
    created: {
        type: Date,
        default: new Date()
    },
    count: {
        type: Number,
        default: 0
    }

},{
    versionKey: false
})

export default mongoose.model("Project", projectSchema);