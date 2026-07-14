import { z } from 'zod';

/**
 * No user-facing request payloads exist for this service (it exposes
 * only a health-check route). Kept for structural consistency with the
 * backend architecture standard's per-service `schemas/` layer.
 */
export const healthQuerySchema = z.object({});

export type HealthQuery = z.infer<typeof healthQuerySchema>;
