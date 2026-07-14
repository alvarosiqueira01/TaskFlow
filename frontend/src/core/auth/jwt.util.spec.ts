import { decodeAccessToken, isAccessTokenValid, getAccessTokenExpiry } from './jwt.util';

describe('jwt.util.ts', () => {
  // Create a mock token. Header: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9 ({"alg":"HS256","typ":"JWT"})
  // Payload: {"sub":"123","exp":9999999999} -> eyJzdWIiOiIxMjMiLCJleHAiOjk5OTk5OTk5OTl9
  const futureToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMiLCJleHAiOjk5OTk5OTk5OTl9.signature';
  
  // Payload: {"sub":"123","exp":1000000000} (Past date) -> eyJzdWIiOiIxMjMiLCJleHAiOjEwMDAwMDAwMDB9
  const pastToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMiLCJleHAiOjEwMDAwMDAwMDB9.signature';

  describe('decodeAccessToken', () => {
    it('decodes a well-formed JWT payload', () => {
      const decoded = decodeAccessToken(futureToken);
      expect(decoded).toEqual({ sub: '123', exp: 9999999999 });
    });

    it('returns null for malformed tokens', () => {
      expect(decodeAccessToken('invalid-token')).toBeNull();
    });
  });

  describe('isAccessTokenValid', () => {
    it('returns true if the token expires in the future', () => {
      expect(isAccessTokenValid(futureToken)).toBe(true);
    });

    it('returns false if the token is expired', () => {
      expect(isAccessTokenValid(pastToken)).toBe(false);
    });

    it('returns false if the token is null or undefined', () => {
      expect(isAccessTokenValid(null)).toBe(false);
      expect(isAccessTokenValid(undefined)).toBe(false);
    });
  });

  describe('getAccessTokenExpiry', () => {
    it('returns a valid Date object for the expiry claim', () => {
      const date = getAccessTokenExpiry(futureToken);
      expect(date).toBeInstanceOf(Date);
      expect(date?.getTime()).toBe(9999999999 * 1000);
    });
  });
});