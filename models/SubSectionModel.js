import mongoose from "mongoose";

const SubSectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    timeDuration: {
      type: Number,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    videoUrl: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const SubSection = mongoose.model("SubSection", SubSectionSchema);

export default SubSection;
