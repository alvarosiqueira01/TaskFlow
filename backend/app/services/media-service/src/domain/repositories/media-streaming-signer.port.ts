export interface SignedStreamUrl {
  url: string;
  expiresAt: Date;
}

/** Port implemented by the Infrastructure layer using CloudFront signed URLs. */
export interface MediaStreamingSigner {
  generateSignedUrl(storageKey: string, expiresInSeconds: number): SignedStreamUrl;
}
