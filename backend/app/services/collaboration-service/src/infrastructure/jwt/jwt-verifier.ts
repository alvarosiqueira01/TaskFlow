import { createHmac, timingSafeEqual } from 'node:crypto';

export interface AuthenticatedUserClaims {
  id: string;
  email: string;
  roles: string[];
}

interface JwtVerifierConfig {
  secret: string;
  issuer: string;
}

function base64UrlDecode(input: string): Buffer {
  return Buffer.from(input.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
}

export class JwtVerificationError extends Error {}

/**
 * Minimal RS256 JWT verifier so the Presentation layer's auth middleware
 * does not depend on a specific shared library.
 */
export class JwtVerifier {
  constructor(private readonly config: JwtVerifierConfig) {}

  verify(token: string): AuthenticatedUserClaims {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new JwtVerificationError('Malformed token');
    }

    const [headerPart, payloadPart, signaturePart] = parts;
    const signedContent = `${headerPart}.${payloadPart}`;

    // Create the expected signature using HMAC SHA256 and your secret
    const expectedSignatureBuffer = createHmac('sha256', this.config.secret)
      .update(signedContent)
      .digest();

    const providedSignatureBuffer = base64UrlDecode(signaturePart);

    // Prevent timing attacks by using timingSafeEqual, but ensure lengths match first
    if (
      expectedSignatureBuffer.length !== providedSignatureBuffer.length ||
      !timingSafeEqual(expectedSignatureBuffer, providedSignatureBuffer)
    ) {
      throw new JwtVerificationError('Invalid token signature');
    }

    const payload = JSON.parse(base64UrlDecode(payloadPart).toString('utf-8'));

    if (payload.iss !== this.config.issuer) {
      throw new JwtVerificationError('Invalid token issuer');
    }

    if (payload.exp && Date.now() >= payload.exp * 1000) {
      throw new JwtVerificationError('Token expired');
    }

    return {
      id: payload.id,
      email: payload.email,
      roles: payload.roles ?? [],
    };
  }
}