import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  projectId: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["Complete", "In Progress", "Cancelled"],
    required: true,
    default: "In Progress",
  },
  client: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }],
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  issues: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue"
    },
  ],
});

export default mongoose.model("Project", projectSchema);
