import { Request, Response, NextFunction } from 'express';
import * as submissionController from '../src/controllers/form.controller';
import Submission from '../src/models/Submission';
import { nanoid } from 'nanoid';

jest.mock('nanoid', () => ({ nanoid: jest.fn() }));
jest.mock('../src/models/Submission');

describe('Submission Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    req = { body: {}, params: {}, headers: {}, ip: '127.0.0.1' };
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock }));
    res = { status: statusMock, json: jsonMock };
    next = jest.fn();
    jest.clearAllMocks();
  });

  
  describe('createSubmission', () => {
    it('should create a submission successfully', async () => {
      (nanoid as jest.Mock).mockReturnValue('test-id');
      (Submission.create as jest.Mock).mockResolvedValue({ anonymousId: 'test-id' });

      await submissionController.createSubmission(req as Request, res as Response, next);

      expect(nanoid).toHaveBeenCalledWith(16);
      expect(Submission.create).toHaveBeenCalledWith(expect.objectContaining({
        anonymousId: 'test-id',
        ip: '127.0.0.1',
        userAgent: undefined
      }));

      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
        anonymousId: 'test-id',
        message: 'Submission created successfully',
      }));
    });

    it('should call next with error if creation fails', async () => {
      const error = new Error('DB Error');
      (Submission.create as jest.Mock).mockRejectedValue(error);

      await submissionController.createSubmission(req as Request, res as Response, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  
  describe('getSubmission', () => {
    it('should get submission by ID', async () => {
      req.params = { id: 'test-id' };

      (Submission.findOne as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue({ anonymousId: 'test-id' }),
      });

      await submissionController.getSubmission(req as Request, res as Response, next);

      expect(Submission.findOne).toHaveBeenCalledWith({ anonymousId: 'test-id' });
      expect(jsonMock).toHaveBeenCalledWith({ anonymousId: 'test-id' });
    });

    it('should get latest submission if no ID', async () => {
      (Submission.findOne as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue({ anonymousId: 'latest-id' }),
        }),
      });

      await submissionController.getSubmission(req as Request, res as Response, next);

      expect(Submission.findOne).toHaveBeenCalled();
      expect(jsonMock).toHaveBeenCalledWith({ anonymousId: 'latest-id' });
    });

    it('should call next with 404 if submission not found', async () => {
      
      (Submission.findOne as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          lean: jest.fn().mockResolvedValue(null),
        }),
      });

      await submissionController.getSubmission(req as Request, res as Response, next);
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 404 }));
    });

    it('should call next with error if find fails', async () => {
      const error = new Error('DB Error');
      (Submission.findOne as jest.Mock).mockImplementation(() => {
        throw error;
      });

      await submissionController.getSubmission(req as Request, res as Response, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  
  describe('updateSubmission', () => {
    it('should update submission successfully', async () => {
      req.params = { id: 'test-id' };
      req.body = { foo: 'bar' };

      (Submission.findOneAndUpdate as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue({ anonymousId: 'test-id', foo: 'bar' }),
      });

      await submissionController.updateSubmission(req as Request, res as Response, next);

      expect(Submission.findOneAndUpdate).toHaveBeenCalledWith(
        { anonymousId: 'test-id' },
        { $set: { foo: 'bar' } },
        { new: true, runValidators: true }
      );
      expect(jsonMock).toHaveBeenCalledWith({ anonymousId: 'test-id', foo: 'bar' });
    });

    it('should call next with 404 if submission not found', async () => {
      req.params = { id: 'test-id' };

      (Submission.findOneAndUpdate as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });

      await submissionController.updateSubmission(req as Request, res as Response, next);
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 404 }));
    });

    it('should call next with error on DB failure', async () => {
      req.params = { id: 'test-id' };
      const error = new Error('DB Error');

      (Submission.findOneAndUpdate as jest.Mock).mockReturnValue({
        lean: jest.fn().mockRejectedValue(error),
      });

      await submissionController.updateSubmission(req as Request, res as Response, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
