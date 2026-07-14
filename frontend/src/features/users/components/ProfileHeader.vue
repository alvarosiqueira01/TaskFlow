<script setup lang="ts">
import { computed } from 'vue';
import type { User } from '../types/user.types';

const props = defineProps<{
  user: User | null;
  loading: boolean;
}>();

const initials = computed(() => {
  const source = props.user?.fullName || props.user?.username || '';
  return source
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();
});

const primaryRoleName = computed(() => props.user?.roles?.[0]?.name ?? 'Member');
</script>

<template>
  <header class="profile-header">
    <div class="profile-header__avatar" aria-hidden="true">
      <img v-if="user?.avatarUrl" :src="user.avatarUrl" alt="" />
      <span v-else>{{ loading ? '' : initials }}</span>
    </div>

    <div class="profile-header__info">
      <p v-if="loading" class="profile-header__name profile-header__name--skeleton">&nbsp;</p>
      <h2 v-else class="profile-header__name">{{ user?.fullName || user?.username }}</h2>

      <template v-if="!loading">
        <p class="profile-header__role">{{ primaryRoleName }}</p>
        <p class="profile-header__email">{{ user?.email }}</p>
      </template>
    </div>
  </header>
</template>

<style scoped>
.profile-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  border-radius: 12px;
  background: var(--color-surface, #ffffff);
  border: 1px solid var(--color-border, #e5e7eb);
}

.profile-header__avatar {
  width: 64px;
  height: 64px;
  border-radius: 999px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary-100, #dbeafe);
  color: var(--color-primary-700, #1d4ed8);
  font-size: 20px;
  font-weight: 600;
  flex-shrink: 0;
}

.profile-header__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-header__info {
  min-width: 0;
}

.profile-header__name {
  margin: 0 0 4px;
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text, #111827);
}

.profile-header__name--skeleton {
  width: 140px;
  height: 20px;
  border-radius: 4px;
  background: var(--color-border, #e5e7eb);
}

.profile-header__role {
  display: inline-block;
  margin: 0 0 4px;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 12px;
  background: var(--color-neutral-100, #f3f4f6);
  color: var(--color-text-muted, #6b7280);
}

.profile-header__email {
  margin: 0;
  font-size: 13px;
  color: var(--color-text-muted, #6b7280);
}
</style>
