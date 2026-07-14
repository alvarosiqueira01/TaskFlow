<script setup lang="ts">
/**
 * shared/components/AvatarGroup.vue
 *
 * Overlapping avatar stack, e.g. for `Task.assignedUsers` shown on
 * `TaskCard` (Kanban board, per `taskflow-screens-visual-description.md`
 * section 3: "assigned user avatars").
 */
import { computed } from 'vue';
import BaseAvatar from './BaseAvatar.vue';

interface AvatarItem {
  id: string;
  name: string;
  avatarUrl?: string | null;
}

interface Props {
  users: AvatarItem[];
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** Maximum number of avatars rendered before collapsing the rest into a "+N" indicator. */
  max?: number;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'sm',
  max: 4,
});

const visibleUsers = computed(() => props.users.slice(0, props.max));
const overflowCount = computed(() => Math.max(0, props.users.length - props.max));

const sizeClasses: Record<NonNullable<Props['size']>, string> = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-lg',
};
</script>

<template>
  <div class="flex -space-x-2">
    <BaseAvatar
      v-for="user in visibleUsers"
      :key="user.id"
      :name="user.name"
      :avatar-url="user.avatarUrl"
      :size="size"
    />
    <span
      v-if="overflowCount > 0"
      class="flex shrink-0 items-center justify-center rounded-full bg-slate-200 font-semibold text-slate-600 ring-2 ring-white"
      :class="sizeClasses[size]"
    >
      +{{ overflowCount }}
    </span>
  </div>
</template>
