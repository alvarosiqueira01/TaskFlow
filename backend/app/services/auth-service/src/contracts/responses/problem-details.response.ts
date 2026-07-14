/**
 * RFC 9457 Problem Details, mirroring the `ProblemDetails` schema
 * defined in _A6_swagger.yaml, used by every error response of this service.
 */
export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  errors?: { field: string; message: string }[];
}
