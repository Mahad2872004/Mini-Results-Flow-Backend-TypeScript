import express, { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { validateBody } from '../middleware/validate';
import { createSubmission, getSubmission, updateSubmission } from '../controllers/form.controller';

const router = express.Router();

const formSchema = Joi.object({
  gender: Joi.string().valid('male', 'female').required(),
  bodyFatPercent: Joi.number().min(0).required(),
  BMI: Joi.number().min(0).required(),
  calorieTarget: Joi.number().min(0).required(),
  waterIntake: Joi.number().min(0).required(),
  weightLossRate: Joi.number().min(0).required(),
  seeResultsDays: Joi.number().min(1).required(),
});

router.post('/', validateBody(formSchema), createSubmission);
router.get('/:id', getSubmission);
router.put('/:id', validateBody(formSchema), updateSubmission);

export default router;
