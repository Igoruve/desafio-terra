import moongoose from "mongoose";

const issueSchema = new moongoose.Schema({
    issueType: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["In progress", "closed", "completed"],
        default: "In progress",
    },
    issueId: {
        type: String,
        required: true,
        trim: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    client: {
        type: moongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    device: {
        type: String,
        enum: ["Desktop", "Mobile", "Tablet"],
        required: true,
    },
    browser: {
        type: String,
        required: true,
    },
    clientComment:{
        type: String,
        required: true,
        trim: true,
    },
    page: {
        type: String,
        required: true,
    },
    screenshot: {
        type: String,
    },
    terraComments: {
        type: String
    },
});

export default moongoose.model("Issue", issueSchema);