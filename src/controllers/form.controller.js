import { nanoid } from 'nanoid';
import createError from 'http-errors';
import Submission from '../models/Submission.js';

// Create a new submission
export async function createSubmission(req, res, next) {
  try {
    const anonymousId = nanoid(16);
    const payload = {
      anonymousId,
      ...req.body,
      ip: req.ip,
      userAgent: req.headers['user-agent']
    };

    const doc = await Submission.create(payload);
    res.status(201).json({
      message: 'Submission created successfully',
      anonymousId: doc.anonymousId,
      createdAt: doc.createdAt,
    });
  } catch (err) {
    next(err);
  }
}

// Get a specific submission by ID or get the latest one if no ID is given
export async function getSubmission(req, res, next) {
  try {
    const { id } = req.params;

    let doc;
    if (id) {
      // If ID is provided, fetch that submission
      doc = await Submission.findOne({ anonymousId: id }).lean();
    } else {
      // If no ID, fetch the latest submission
      doc = await Submission.findOne().sort({ createdAt: -1 }).lean();
    }

    if (!doc) throw createError(404, 'Submission not found');
    res.json(doc);
  } catch (err) {
    next(err);
  }
}

// Update a submission by ID
export async function updateSubmission(req, res, next) {
  try {
    const { id } = req.params;
    const doc = await Submission.findOneAndUpdate(
      { anonymousId: id },
      { $set: req.body },
      { new: true, runValidators: true }
    ).lean();

    if (!doc) throw createError(404, 'Submission not found');
    res.json(doc);
  } catch (err) {
    next(err);
  }
}
