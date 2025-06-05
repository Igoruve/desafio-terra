import moongoose from "mongoose";

const issueSchema = new moongoose.Schema({
    issueType: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["in progress", "closed", "completed"],
        default: "in progress",
    },
    issueId: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    createdAt: {
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
        default: "Desktop",
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