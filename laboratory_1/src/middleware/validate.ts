import type { NextFunction, Request, Response } from "express";
import type { Schema } from "yup";

export const validate = (schema: Schema) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await schema.validate(req.body, { abortEarly: false });
    next(); 
  } catch (error: any) {
    res.status(400).render('error', { errors: error.errors });
  }
};