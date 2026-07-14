import type { OpenApiDocumentBase } from './base-openapi-document';

export function mergeOpenApiDocuments(
  title: string,
  version: string,
  documents: OpenApiDocumentBase[],
): OpenApiDocumentBase {
  const merged: OpenApiDocumentBase = {
    openapi: '3.1.0',
    info: {
      title,
      version,
      description: 'Consolidated OpenAPI specification for the Distributed Task Manager backend.',
    },
    servers: documents[0]?.servers ?? [],
    components: {
      securitySchemes: {},
      schemas: {},
    },
    security: documents[0]?.security ?? [],
    tags: [],
    paths: {},
  };

  const seenTagNames = new Set<string>();

  for (const doc of documents) {
    Object.assign(merged.components.securitySchemes, doc.components.securitySchemes);
    Object.assign(merged.components.schemas, doc.components.schemas);
    Object.assign(merged.paths, doc.paths);

    for (const tag of doc.tags) {
      if (!seenTagNames.has(tag.name)) {
        seenTagNames.add(tag.name);
        merged.tags.push(tag);
      }
    }
  }

  return merged;
}
