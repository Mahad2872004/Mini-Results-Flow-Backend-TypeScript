import { Request, Response, NextFunction } from 'express';
import { nanoid } from 'nanoid';
import createError from 'http-errors';
import Submission, { ISubmission } from '../models/Submission'; 

// Create a new submission
export async function createSubmission(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const anonymousId = nanoid(16);
    const payload: Partial<ISubmission> = {
      anonymousId,
      ...req.body,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    };

    const doc = await Submission.create(payload);
    res.status(201).json({
      message: 'Submission created successfully',
      anonymousId: doc.anonymousId,
    });
  } catch (err) {
    next(err);
  }
}

// Get a specific submission by ID or latest if no ID is provided
export async function getSubmission(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;

    let doc: ISubmission | null;
    if (id) {
      doc = await Submission.findOne({ anonymousId: id }).lean<ISubmission>();
    } else {
      doc = await Submission.findOne().sort({ createdAt: -1 }).lean<ISubmission>();
    }

    if (!doc) throw createError(404, 'Submission not found');
    res.json(doc);
  } catch (err) {
    next(err);
  }
}

// Update 
export async function updateSubmission(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const doc = await Submission.findOneAndUpdate(
      { anonymousId: id },
      { $set: req.body },
      { new: true, runValidators: true }
    ).lean<ISubmission>();

    if (!doc) throw createError(404, 'Submission not found');
    res.json(doc);
  } catch (err) {
    next(err);
  }
}
