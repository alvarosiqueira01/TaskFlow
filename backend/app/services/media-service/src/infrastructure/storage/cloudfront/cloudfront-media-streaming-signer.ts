import { createSign } from 'node:crypto';
import { MediaStreamingSigner, SignedStreamUrl } from '../../../domain/repositories/media-streaming-signer.port';

export interface CloudFrontSignerConfig {
  domain: string;
  keyPairId: string;
  privateKey: string;
}

/**
 * Generates CloudFront canned-policy signed URLs, per (A5)streaming-design.md §5.3 and §8.
 * Uses RSA-SHA1 signing as required by the CloudFront signed URL specification.
 */
export class CloudFrontMediaStreamingSigner implements MediaStreamingSigner {
  constructor(private readonly config: CloudFrontSignerConfig) {}

  generateSignedUrl(storageKey: string, expiresInSeconds: number): SignedStreamUrl {
    const expiresAt = new Date(Date.now() + expiresInSeconds * 1000);
    const expiresAtEpochSeconds = Math.floor(expiresAt.getTime() / 1000);
    const resourceUrl = `https://${this.config.domain}/${storageKey}`;

    const policy = JSON.stringify({
      Statement: [
        {
          Resource: resourceUrl,
          Condition: {
            DateLessThan: { 'AWS:EpochTime': expiresAtEpochSeconds },
          },
        },
      ],
    });

    const signer = createSign('RSA-SHA1');
    signer.update(policy);
    signer.end();

    const signature = signer
      .sign(this.config.privateKey)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/=/g, '_')
      .replace(/\//g, '~');

    const encodedPolicy = Buffer.from(policy)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/=/g, '_')
      .replace(/\//g, '~');

    const url =
      `${resourceUrl}?Policy=${encodedPolicy}` +
      `&Signature=${signature}` +
      `&Key-Pair-Id=${this.config.keyPairId}`;

    return { url, expiresAt };
  }
}
