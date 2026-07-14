/**
 * Public API surface of the Collaboration feature. Since this feature
 * owns no pages/routes (comments are always embedded elsewhere, per the
 * UI/UX guidelines), this barrel is the sanctioned integration point for
 * other features that need to embed a comment thread — avoiding deep
 * imports into internal component/composable paths.
 */
export { default as CommentThread } from './components/CommentThread.vue';
export * from './types/comment.types';
export { useTaskComments } from './composables/useTaskComments';
export { useMentionPicker } from './composables/useMentionPicker';
export { useCommentStore } from './store/commentStore';
