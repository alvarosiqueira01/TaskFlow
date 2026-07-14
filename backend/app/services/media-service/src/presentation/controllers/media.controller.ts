import { FastifyReply, FastifyRequest } from 'fastify';
import { GenerateUploadUrlUseCase } from '../../application/use-cases/generate-upload-url.use-case';
import { InitiateMultipartUploadUseCase } from '../../application/use-cases/initiate-multipart-upload.use-case';
import { GetMultipartPartUrlsUseCase } from '../../application/use-cases/get-multipart-part-urls.use-case';
import { CompleteMultipartUploadUseCase } from '../../application/use-cases/complete-multipart-upload.use-case';
import { CompleteMediaUploadUseCase } from '../../application/use-cases/complete-media-upload.use-case';
import { GetMediaStreamUrlUseCase } from '../../application/use-cases/get-media-stream-url.use-case';
import { GetMediaMetadataUseCase } from '../../application/use-cases/get-media-metadata.use-case';
import { DeleteMediaUseCase } from '../../application/use-cases/delete-media.use-case';
import { ReplaceMediaUseCase } from '../../application/use-cases/replace-media.use-case';
import {
  validateCompleteMediaUploadRequest,
  validateCompleteMultipartUploadRequest,
  validateGenerateUploadUrlRequest,
  validateInitiateMultipartUploadRequest,
  validateMediaIdParam,
  validateMultipartPartsRequest,
  validateReplaceMediaRequest,
} from '../validators/media.validators';
import { AuthenticationError } from '../middleware/auth.middleware';

export interface MediaControllerDependencies {
  generateUploadUrlUseCase: GenerateUploadUrlUseCase;
  initiateMultipartUploadUseCase: InitiateMultipartUploadUseCase;
  getMultipartPartUrlsUseCase: GetMultipartPartUrlsUseCase;
  completeMultipartUploadUseCase: CompleteMultipartUploadUseCase;
  completeMediaUploadUseCase: CompleteMediaUploadUseCase;
  getMediaStreamUrlUseCase: GetMediaStreamUrlUseCase;
  getMediaMetadataUseCase: GetMediaMetadataUseCase;
  deleteMediaUseCase: DeleteMediaUseCase;
  replaceMediaUseCase: ReplaceMediaUseCase;
}

export class MediaController {
  constructor(private readonly deps: MediaControllerDependencies) {}

  private requireUser(request: FastifyRequest) {
    if (!request.user || !request.bearerToken) {
      throw new AuthenticationError();
    }
    return { user: request.user, bearerToken: request.bearerToken };
  }

  generateUploadUrl = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const { user, bearerToken } = this.requireUser(request);
    const data = validateGenerateUploadUrlRequest(request.body);

    const result = await this.deps.generateUploadUrlUseCase.execute({
      requesterId: user.id,
      bearerToken,
      data,
    });

    reply.code(200).send(result);
  };

  initiateMultipartUpload = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const { user, bearerToken } = this.requireUser(request);
    const data = validateInitiateMultipartUploadRequest(request.body);

    const result = await this.deps.initiateMultipartUploadUseCase.execute({
      requesterId: user.id,
      bearerToken,
      data,
    });

    reply.code(200).send(result);
  };

  getMultipartPartUrls = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const { user } = this.requireUser(request);
    const { id } = validateMediaIdParam(request.params);
    const { parts } = validateMultipartPartsRequest(request.body);

    const result = await this.deps.getMultipartPartUrlsUseCase.execute({
      uploadId: id,
      requesterId: user.id,
      parts,
    });

    reply.code(200).send(result);
  };

  completeMultipartUpload = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const { user } = this.requireUser(request);
    const { id } = validateMediaIdParam(request.params);
    const data = validateCompleteMultipartUploadRequest(request.body);

    const result = await this.deps.completeMultipartUploadUseCase.execute({
      uploadId: id,
      requesterId: user.id,
      data,
    });

    reply.code(201).send(result);
  };

  completeMediaUpload = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const { user } = this.requireUser(request);
    const data = validateCompleteMediaUploadRequest(request.body);

    const result = await this.deps.completeMediaUploadUseCase.execute({
      requesterId: user.id,
      data,
    });

    reply.code(201).send(result);
  };

  getStreamUrl = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const { user, bearerToken } = this.requireUser(request);
    const { id } = validateMediaIdParam(request.params);

    const result = await this.deps.getMediaStreamUrlUseCase.execute({
      mediaId: id,
      requesterId: user.id,
      bearerToken,
    });

    reply.code(200).send(result);
  };

  getMetadata = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const { user, bearerToken } = this.requireUser(request);
    const { id } = validateMediaIdParam(request.params);

    const result = await this.deps.getMediaMetadataUseCase.execute({
      mediaId: id,
      requesterId: user.id,
      bearerToken,
    });

    reply.code(200).send(result);
  };

  remove = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const { user } = this.requireUser(request);
    const { id } = validateMediaIdParam(request.params);

    await this.deps.deleteMediaUseCase.execute({
      mediaId: id,
      requesterId: user.id,
      requesterRoles: user.roles,
    });

    reply.code(204).send();
  };

  replace = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const { user } = this.requireUser(request);
    const { id } = validateMediaIdParam(request.params);
    const data = validateReplaceMediaRequest(request.body);

    const result = await this.deps.replaceMediaUseCase.execute({
      mediaId: id,
      requesterId: user.id,
      requesterRoles: user.roles,
      data,
    });

    reply.code(200).send(result);
  };
}
