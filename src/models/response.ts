export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  reasonStatusCode: string;
  metadata?: T;
  createdAt?: string;
}
