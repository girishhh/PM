export interface ResponseError extends Error {
  status?: number;
  errors?: any;
}

export interface KeyValue {
  [key: string]: any;
}
