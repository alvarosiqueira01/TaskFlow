export interface ProblemDetailsFieldError {
  field: string;
  message: string;
}

export interface ProblemDetailsResponse {
  type: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  errors?: ProblemDetailsFieldError[];
}
