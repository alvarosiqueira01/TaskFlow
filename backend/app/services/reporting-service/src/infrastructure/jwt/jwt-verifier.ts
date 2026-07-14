import { createVerify } from 'node:crypto';

export interface AuthenticatedUserClaims {
  id: string;
  email: string;
  roles: string[];
}

interface JwtVerifierConfig {
  publicKey: string;
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

    const verifier = createVerify('RSA-SHA256');
    verifier.update(signedContent);
    verifier.end();

    const isValid = verifier.verify(this.config.publicKey, base64UrlDecode(signaturePart));
    if (!isValid) {
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
