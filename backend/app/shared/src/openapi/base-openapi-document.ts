export interface OpenApiDocumentBase {
  openapi: string;
  info: {
    title: string;
    version: string;
    description?: string;
  };
  servers: { url: string; description?: string }[];
  components: {
    securitySchemes: Record<string, unknown>;
    schemas: Record<string, unknown>;
  };
  security: Record<string, unknown[]>[];
  tags: { name: string; description?: string }[];
  paths: Record<string, unknown>;
}

export function buildBaseOpenApiDocument(serviceName: string, version = '1.1.0'): OpenApiDocumentBase {
  return {
    openapi: '3.1.0',
    info: {
      title: `${serviceName} API`,
      version,
      description: `OpenAPI specification for the ${serviceName} microservice.`,
    },
    servers: [{ url: '/v1', description: 'API Gateway base path' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        ProblemDetails: {
          type: 'object',
          properties: {
            type: { type: 'string', format: 'uri' },
            title: { type: 'string' },
            status: { type: 'integer' },
            detail: { type: 'string' },
            instance: { type: 'string', format: 'uri' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' }
                }
              }
            }
          },
          required: ['type', 'title', 'status'],
        },
        CursorPaginatedResponse: {
          type: 'object',
          properties: {
            limit: { type: 'integer' },
            nextCursor: { type: 'string', nullable: true },
            total: { type: 'integer' },
          },
          required: ['limit'],
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [],
    paths: {},
  };
}
