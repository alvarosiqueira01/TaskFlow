export interface JwtPayload {
  sub: string; // user id
  email: string;
  roles: string[]; // Role names like 'ADMIN', 'USER'
  iat?: number;
  exp?: number;
}
