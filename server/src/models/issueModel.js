import mongoose from "mongoose";

const issueSchema = new mongoose.Schema({
    issueType: {
        type: String,
        enum: ["Copy revision", "Requested Change", "New Item", 
                "Bug Fix", "Design Issues", "Not Addressing", "Other"],
        required: true,
    },
    status: {
        type: String,
        enum: ["On Hold", "In Progress", "Complete", 
            "Post Launch", "Needs Inputs", "Ready to upload",
            "Duplicate Comment", "Other"],
        default: "On Hold",
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
        type: mongoose.Schema.Types.ObjectId,
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

export default mongoose.model("Issue", issueSchema);