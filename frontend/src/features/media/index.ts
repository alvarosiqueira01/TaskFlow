/**
 * Public API surface of the Media feature. No pages/routes are exported
 * since attachments are always embedded elsewhere (Task Details); this
 * barrel is the sanctioned integration point for other features.
 */
export { default as MediaAttachmentList } from './components/MediaAttachmentList.vue';
export { default as MediaPlayer } from './components/MediaPlayer.vue';
export * from './types/media.types';
export { useTaskAttachments } from './composables/useTaskAttachments';
export { useMediaStream } from './composables/useMediaStream';
export { useMediaStore } from './store/mediaStore';
