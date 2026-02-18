import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
    {
        companyName: { type: String, required: true, trim: true },
        role: { type: String, required: true, trim: true },
        status: {
            type: String,
            enum: ["Applied", "Interview", "Offer", "Rejected"],
            default: "Applied",
        },
        notes: { type: String, default: "" },
    },
    { timestamps: true }
);

export const Job = mongoose.model("Job", jobSchema);
