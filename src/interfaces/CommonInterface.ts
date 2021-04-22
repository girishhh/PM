export interface ResponseError extends Error {
  status?: number;
  errors?: any;
}

export interface KeyValue {
  [key: string]: any;
}

export interface UpdateResponse {
  n: 1;
  nModified: 1;
  ok: 1;
}
