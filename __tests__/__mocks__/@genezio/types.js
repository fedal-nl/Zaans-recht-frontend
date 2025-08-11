// Mock for @genezio/types
export class GenezioError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = 'GenezioError';
    this.statusCode = statusCode;
  }
}