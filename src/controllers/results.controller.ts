import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import Submission from '../models/Submission.js';
import { computeFromForm } from '../services/compute.service.js';


interface SubmissionDoc {
  anonymousId: string;
  gender: string;
  createdAt: Date;
  [key: string]: any;
}

export async function getResults(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Find the most recently created form submission
    const doc = (await Submission.findOne()
      .sort({ createdAt: -1 })
      .lean()) as SubmissionDoc | null;

    if (!doc) throw createError(404, 'No submissions found');

   const computed = computeFromForm(doc as any);



    res.json({
      anonymousId: doc.anonymousId,
      formData: {
        gender: computed.gender,
        bodyFatPercent: computed.bodyFatPercent,
        BMI: computed.BMI,
        calorieTarget: computed.calorieTarget,
        waterIntake: computed.waterIntake,
        weightLossRate: computed.weightLossRate,
        seeResultsDays: computed.seeResultsDays,
      },
      labels: computed.labels,
      createdAt: doc.createdAt,
    });
  } catch (err) {
    next(err);
  }
}
