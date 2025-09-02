import { Request, Response, NextFunction } from 'express';
import Submission from '../src/models/Submission';
import { computeFromForm } from '../src/services/compute.service';


jest.mock('../src/models/Submission');
jest.mock('../src/services/compute.service');


import * as resultsController from '../src/controllers/results.controller';

describe('getResults Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    req = {};
    jsonMock = jest.fn();
    res = { json: jsonMock };
    next = jest.fn();
    jest.clearAllMocks();

    
    (computeFromForm as jest.Mock).mockReturnValue({
      gender: 'male',
      bodyFatPercent: 20,
      BMI: 22,
      calorieTarget: 2000,
      waterIntake: 2,
      weightLossRate: 0.5,
      seeResultsDays: 30,
      labels: ['test'],
    });
  });

  it('should return results successfully when submission exists', async () => {
    const mockDoc = {
      anonymousId: 'test-id',
      gender: 'male',
      createdAt: new Date(),
    } as any; 

    
    (Submission.findOne as jest.Mock).mockReturnValue({
      sort: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockDoc),
      }),
    });

    await resultsController.getResults(req as Request, res as Response, next);

    expect(Submission.findOne).toHaveBeenCalled();
    expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
      anonymousId: mockDoc.anonymousId,
      formData: expect.objectContaining({
        gender: 'male',
        bodyFatPercent: 20,
        BMI: 22,
        calorieTarget: 2000,
        waterIntake: 2,
        weightLossRate: 0.5,
        seeResultsDays: 30,
      }),
      labels: ['test'],
      createdAt: mockDoc.createdAt,
    }));
  });

  it('should call next with 404 if no submissions found', async () => {
    (Submission.findOne as jest.Mock).mockReturnValue({
      sort: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      }),
    });

    await resultsController.getResults(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 404 }));
  });

  it('should call next if Mongoose throws an error', async () => {
    const error = new Error('DB Error');
    (Submission.findOne as jest.Mock).mockImplementation(() => { throw error; });

    await resultsController.getResults(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
