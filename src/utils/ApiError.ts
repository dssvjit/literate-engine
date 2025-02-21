export class ApiError extends Error {
  statusCode: number;
  data: {} | null;
  message: string;
  error?: string;

  constructor(statusCode: number, message = "Someting went wrong", error = "") {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.error = error;
  }
}
