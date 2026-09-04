import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError, ZodIssue } from 'zod';

interface ValidationError {
  field: string;
  message: string;
}

export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: ValidationError[] = error.errors.map((err: ZodIssue) => ({
          field: err.path.join('.').replace('body.', ''),
          message: err.message
        }));

        res.status(400).json({
          status: 'error',
          message: 'Input validation failed',
          errors
        });
        return;
      }
      
      res.status(500).json({
        status: 'error',
        message: 'Internal server validation error'
      });
    }
  };
};