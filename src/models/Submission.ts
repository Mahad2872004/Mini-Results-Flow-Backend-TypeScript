import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ISubmission extends Document {
  anonymousId?: string;
  gender: 'male' | 'female';
  bodyFatPercent: number;
  BMI: number;
  calorieTarget: number;
  waterIntake: number;
  weightLossRate: number;
  seeResultsDays: number;
  ip?: string;
  userAgent?: string;
}

// schema
const SubmissionSchema: Schema<ISubmission> = new Schema(
  {
    anonymousId: { type: String, unique: true, index: true },
    gender: { type: String, enum: ['male', 'female'], required: true },
    bodyFatPercent: { type: Number, required: true, min: 0 },
    BMI: { type: Number, required: true, min: 0 },
    calorieTarget: { type: Number, required: true, min: 0 },
    waterIntake: { type: Number, required: true, min: 0 },
    weightLossRate: { type: Number, required: true, min: 0 },
    seeResultsDays: { type: Number, required: true, min: 1 },
    ip: { type: String },
    userAgent: { type: String },
  },
  { timestamps: true }
);

// model
const Submission: Model<ISubmission> = mongoose.model<ISubmission>('Submission', SubmissionSchema);

export default Submission;
