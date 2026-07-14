<script setup lang="ts">
/**
 * shared/components/UserMenu.vue
 *
 * Generic account dropdown: avatar trigger + a configurable list of
 * actions (Profile, Log out, ...), per
 * `taskflow-screens-visual-description.md` section 1 ("Sidebar...
 * footer section containing the current user profile and settings")
 * and UI-UX-guidelines.md section 29 ("UserMenu").
 *
 * NOTE: `DashboardLayout.vue` / `AdminLayout.vue` currently inline
 * their own equivalent dropdown markup (generated in the prior
 * `core`/`layouts` scope). This component is the reusable primitive a
 * future pass should migrate those layouts to — it is not applied
 * retroactively here to avoid modifying out-of-scope files.
 */
import { ref } from 'vue';
import { ChevronDown, type LucideIcon } from 'lucide-vue-next';
import BaseAvatar from './BaseAvatar.vue';
import { vClickOutside } from '../directives/click-outside.directive';

export interface UserMenuAction {
  label: string;
  icon?: LucideIcon;
  /** `danger` renders the action in red (e.g. "Log out"). */
  variant?: 'default' | 'danger';
}

interface Props {
  name: string;
  subtitle?: string;
  avatarUrl?: string | null;
  actions: UserMenuAction[];
}

withDefaults(defineProps<Props>(), {
  subtitle: undefined,
  avatarUrl: null,
});

const emit = defineEmits<{ select: [UserMenuAction] }>();

const isOpen = ref(false);

function toggle(): void {
  isOpen.value = !isOpen.value;
}

function close(): void {
  isOpen.value = false;
}

function handleSelect(action: UserMenuAction): void {
  emit('select', action);
  close();
}
</script>

<template>
  <div v-click-outside="close" class="relative">
    <button
      type="button"
      class="flex items-center gap-2 rounded-full border border-slate-200 py-1 pl-1 pr-3 text-sm transition-colors duration-200 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      :aria-expanded="isOpen"
      aria-haspopup="menu"
      @click="toggle"
    >
      <BaseAvatar :name="name" :avatar-url="avatarUrl" size="sm" />
      <span class="max-w-[10rem] truncate font-medium text-slate-700">{{ name }}</span>
      <ChevronDown class="h-4 w-4 text-slate-400" aria-hidden="true" />
    </button>

    <Transition
      enter-active-class="transition-all duration-150 ease-out"
      leave-active-class="transition-all duration-100 ease-in"
      enter-from-class="opacity-0 scale-95"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        role="menu"
        class="absolute right-0 z-10 mt-2 w-56 rounded-lg border border-slate-200 bg-white py-1 shadow-md"
      >
        <div class="border-b border-slate-100 px-4 py-3">
          <p class="truncate text-sm font-medium text-slate-900">{{ name }}</p>
          <p v-if="subtitle" class="truncate text-xs text-slate-500">{{ subtitle }}</p>
        </div>

        <button
          v-for="action in actions"
          :key="action.label"
          type="button"
          role="menuitem"
          class="flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-slate-50"
          :class="action.variant === 'danger' ? 'text-red-600' : 'text-slate-700'"
          @click="handleSelect(action)"
        >
          <component :is="action.icon" v-if="action.icon" class="h-4 w-4" aria-hidden="true" />
          {{ action.label }}
        </button>
      </div>
    </Transition>
  </div>
</template>
