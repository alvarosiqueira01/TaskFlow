import { z } from 'zod';
import { mapZodErrorToFieldErrors } from './field-error-mapper';

describe('field-error-mapper.ts', () => {
  it('maps a ZodError to a FieldErrorMap dictionary', () => {
    const schema = z.object({
      email: z.string().email('Invalid email format'),
      password: z.string().min(8, 'Too short'),
    });

    const result = schema.safeParse({ email: 'not-an-email', password: '123' });
    
    if (!result.success) {
      const mapped = mapZodErrorToFieldErrors(result.error);
      
      expect(mapped).toEqual({
        email: 'Invalid email format',
        password: 'Too short',
      });
    } else {
      fail('Schema should have failed validation');
    }
  });

  it('handles nested paths appropriately', () => {
    const schema = z.object({
      confirmPassword: z.string()
    }).refine(_val => false, {
      message: 'Passwords do not match',
      path: ['confirmPassword']
    });

    const result = schema.safeParse({ confirmPassword: 'test' });
    
    if (!result.success) {
      const mapped = mapZodErrorToFieldErrors(result.error);
      expect(mapped['confirmPassword']).toBe('Passwords do not match');
    }
  });
});