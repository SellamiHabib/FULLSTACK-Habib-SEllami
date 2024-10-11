import { NextFunction, Request, Response } from 'express';
import { z, ZodError, ZodIssue } from 'zod';

import { StatusCodes } from 'http-status-codes';
import { CustomError } from '../utils/CustomError';

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validateData(schema: z.ZodObject<any, any, any, any, any> | z.ZodString) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: ZodIssue) => ({
          message: `${issue.path.join('.')} is ${issue.message}`,
        }));
        res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid data', details: errorMessages });
      } else {
        throw new CustomError('Invalid data', StatusCodes.BAD_REQUEST);
      }
    }
  };
}
