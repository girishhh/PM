export interface ResponseError extends Error {
  status?: number;
  errors?: any;
}
