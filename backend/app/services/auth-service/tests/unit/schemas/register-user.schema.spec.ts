import { registerUserBodySchema } from '../../../src/schemas/register-user.schema';

describe('registerUserBodySchema', () => {
  it('accepts a valid payload', () => {
    const result = registerUserBodySchema.safeParse({
      username: 'jane.doe',
      email: 'jane@example.com',
      password: 'S3curePass!',
      fullName: 'Jane Doe',
    });

    expect(result.success).toBe(true);
  });

  it('rejects a password shorter than 8 characters', () => {
    const result = registerUserBodySchema.safeParse({
      username: 'jane.doe',
      email: 'jane@example.com',
      password: 'short',
    });

    expect(result.success).toBe(false);
  });

  it('rejects a malformed email', () => {
    const result = registerUserBodySchema.safeParse({
      username: 'jane.doe',
      email: 'not-an-email',
      password: 'S3curePass!',
    });

    expect(result.success).toBe(false);
  });
});
