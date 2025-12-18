export interface ApiResponse<T> {
  msg: string;
  errorCode: number;
  success: boolean;
  data: T;
}
