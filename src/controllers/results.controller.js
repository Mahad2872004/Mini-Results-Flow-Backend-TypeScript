import createError from 'http-errors';
import Submission from '../models/Submission.js';
import { computeFromForm } from '../services/compute.service.js';

export async function getResults(req, res, next) {
  try {
    // Find the most recently created submission
    const doc = await Submission.findOne().sort({ createdAt: -1 }).lean();
    if (!doc) throw createError(404, 'No submissions found');

    const computed = computeFromForm(doc);

    res.json({
      anonymousId: doc.anonymousId,
      formData: {
        gender: computed.gender,
        bodyFatPercent: computed.bodyFatPercent,
        BMI: computed.BMI,
        calorieTarget: computed.calorieTarget,
        waterIntake: computed.waterIntake,
        weightLossRate: computed.weightLossRate,
        seeResultsDays: computed.seeResultsDays
      },
      labels: computed.labels,
      createdAt: doc.createdAt
    });
  } catch (err) {
    next(err);
  }
}
