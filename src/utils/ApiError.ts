export class ApiError extends Error {
  statusCode: number;
  data: {} | null;
  message: string;
  error?: any; // Change type to allow full error messages

  constructor(
    statusCode: number,
    message = "Something went wrong",
    error?: any
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.error = error || message; // Ensure meaningful error output
  }
}
