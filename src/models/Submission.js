import mongoose from 'mongoose';

const SubmissionSchema = new mongoose.Schema(
  {
    anonymousId: { type: String, unique: true, index: true },
    gender: { type: String, enum: ['male', 'female'], required: true },
    bodyFatPercent: { type: Number, required: true, min: 0 },
    BMI: { type: Number, required: true, min: 0 },
    calorieTarget: { type: Number, required: true, min: 0 },
    waterIntake: { type: Number, required: true, min: 0 },
    weightLossRate: { type: Number, required: true, min: 0 },
    seeResultsDays: { type: Number, required: true, min: 1 },

    ip: String,
    userAgent: String
  },
  { timestamps: true }
);

const Submission = mongoose.model('Submission', SubmissionSchema);

export default Submission;
