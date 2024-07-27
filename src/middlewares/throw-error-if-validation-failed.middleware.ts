import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export const throwErrorIfValidationFailed = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({ errors: errors.array() });
  }
  next();
};
