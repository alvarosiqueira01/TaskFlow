import { useMediaUpload } from './useMediaUpload';
import { MediaService } from '../services/MediaService';
import { MULTIPART_THRESHOLD_BYTES } from '../constants/upload';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';

vi.mock('../services/MediaService');

beforeEach(() => {
  vi.clearAllMocks();
});

describe('useMediaUpload.ts', () => {
  it('uses standard upload flow for files under the threshold', { timeout: 50000 }, async () => {
    const { uploadFile, status } = useMediaUpload();
    const smallFile = new File([''], 'small.mp4', { type: 'video/mp4' });
    Object.defineProperty(smallFile, 'size', { value: MULTIPART_THRESHOLD_BYTES - 100 });

    (MediaService.generateUploadUrl as Mock).mockResolvedValue({ uploadUrl: 'http://s3.local', uploadId: '1' });
    
    // Note: In a full test, putToS3 and computeSha256 would also be mocked.
    // For this assertion, we ensure generateUploadUrl is called, not initiateMultipartUpload.
    try { await uploadFile('task-123', smallFile); } catch (e) {}

    expect(MediaService.generateUploadUrl).toHaveBeenCalled();
    expect(MediaService.initiateMultipartUpload).not.toHaveBeenCalled();
    expect(status.value).not.toBe('idle');
  });

  it('uses multipart upload flow for files over the threshold', { timeout: 50000 }, async () => {
    const { uploadFile } = useMediaUpload();
    const largeFile = new File([''], 'large.mp4', { type: 'video/mp4' });
    Object.defineProperty(largeFile, 'size', { value: MULTIPART_THRESHOLD_BYTES + 100 });

    (MediaService.initiateMultipartUpload as Mock).mockResolvedValue({ uploadId: 'multi-1' });
    (MediaService.getMultipartPreSignedUrls as Mock).mockResolvedValue({ partUrls: [] });

    try { await uploadFile('task-123', largeFile); } catch (e) {}

    expect(MediaService.initiateMultipartUpload).toHaveBeenCalled();
    expect(MediaService.generateUploadUrl).not.toHaveBeenCalled();
  });
});
