import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      userId?: number; // Add your custom property here
    }
  }
}
