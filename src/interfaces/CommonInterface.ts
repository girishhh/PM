import { Request as ExpressRequest } from "express";

export interface ResponseError extends Error {
  status?: number;
  errors?: any;
}

export interface Request extends ExpressRequest {
  subdomain: string;
}
