export class ApiResponse {
  statusCode: number;
  message: string;
  data: null | {};
  success: "Success" | "Failure";

  constructor(statusCode: number, data: {}, message = "Success") {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = statusCode < 400 ? "Success" : "Failure";
  }
}
