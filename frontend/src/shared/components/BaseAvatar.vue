<script setup lang="ts">
/**
 * shared/components/BaseAvatar.vue
 *
 * Renders a user's `avatarUrl` (see swagger.yaml `User.avatarUrl`) when
 * present, falling back to initials derived from their display name.
 * Used standalone (comments, activity feed) and composed by
 * `AvatarGroup` (task assignees).
 */
import { computed } from 'vue';
import { getInitials } from '../utils/string.util';

interface Props {
  name: string;
  avatarUrl?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<Props>(), {
  avatarUrl: null,
  size: 'md',
});

const sizeClasses: Record<NonNullable<Props['size']>, string> = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-lg',
};

const initials = computed(() => getInitials(props.name));
</script>

<template>
  <img
    v-if="avatarUrl"
    :src="avatarUrl"
    :alt="name"
    class="shrink-0 rounded-full object-cover ring-2 ring-white"
    :class="sizeClasses[size]"
  />
  <span
    v-else
    class="flex shrink-0 select-none items-center justify-center rounded-full bg-slate-900 font-semibold text-white ring-2 ring-white"
    :class="sizeClasses[size]"
    role="img"
    :aria-label="name"
  >
    {{ initials }}
  </span>
</template>
