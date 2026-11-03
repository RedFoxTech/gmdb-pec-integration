import axios, { AxiosError } from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
});

export type PromiseResponseError = AxiosError<{
  error: string;
  message: string;
  statusCode: number;
}>;

export type PromiseResponse<T> = Promise<{
  data?: T;
  error?: PromiseResponseError;
}>;

export default api;
