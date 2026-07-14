<script setup lang="ts">
import { useUserPreferences } from '../composables/useUserPreferences';

const { preferences, togglePreference } = useUserPreferences();
</script>

<template>
  <section class="preferences-panel" aria-label="Application preferences">
    <h3 class="preferences-panel__title">Preferences</h3>
    <p class="preferences-panel__hint">
      These settings apply to this session only, until a preferences endpoint is available.
    </p>

    <ul class="preferences-panel__list">
      <li class="preferences-panel__row">
        <div>
          <p class="preferences-panel__label">Email notifications</p>
          <p class="preferences-panel__description">Receive a daily digest by email.</p>
        </div>
        <button
          type="button"
          role="switch"
          :aria-checked="preferences.emailDailyDigest"
          aria-label="Toggle email notifications"
          class="preferences-panel__toggle"
          :class="{ 'preferences-panel__toggle--on': preferences.emailDailyDigest }"
          @click="togglePreference('emailDailyDigest')"
        >
          <span class="preferences-panel__toggle-thumb" />
        </button>
      </li>

      <li class="preferences-panel__row">
        <div>
          <p class="preferences-panel__label">Play attachments inline</p>
          <p class="preferences-panel__description">Preview media attachments on hover.</p>
        </div>
        <button
          type="button"
          role="switch"
          :aria-checked="preferences.playAttachmentsInline"
          aria-label="Toggle inline attachment playback"
          class="preferences-panel__toggle"
          :class="{ 'preferences-panel__toggle--on': preferences.playAttachmentsInline }"
          @click="togglePreference('playAttachmentsInline')"
        >
          <span class="preferences-panel__toggle-thumb" />
        </button>
      </li>

      <li class="preferences-panel__row">
        <div>
          <p class="preferences-panel__label">Reduce motion</p>
          <p class="preferences-panel__description">Minimize animations across the app.</p>
        </div>
        <button
          type="button"
          role="switch"
          :aria-checked="preferences.reduceMotion"
          aria-label="Toggle reduced motion"
          class="preferences-panel__toggle"
          :class="{ 'preferences-panel__toggle--on': preferences.reduceMotion }"
          @click="togglePreference('reduceMotion')"
        >
          <span class="preferences-panel__toggle-thumb" />
        </button>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.preferences-panel {
  padding: 24px;
  border-radius: 12px;
  background: var(--color-surface, #ffffff);
  border: 1px solid var(--color-border, #e5e7eb);
}

.preferences-panel__title {
  margin: 0 0 4px;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text, #111827);
}

.preferences-panel__hint {
  margin: 0 0 16px;
  font-size: 12px;
  color: var(--color-text-muted, #6b7280);
}

.preferences-panel__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.preferences-panel__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.preferences-panel__label {
  margin: 0 0 2px;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text, #111827);
}

.preferences-panel__description {
  margin: 0;
  font-size: 12px;
  color: var(--color-text-muted, #6b7280);
}

.preferences-panel__toggle {
  position: relative;
  width: 40px;
  height: 22px;
  border-radius: 999px;
  border: none;
  background: var(--color-neutral-300, #d1d5db);
  cursor: pointer;
  flex-shrink: 0;
  transition: background-color 0.2s ease;
}

.preferences-panel__toggle--on {
  background: var(--color-primary-600, #2563eb);
}

.preferences-panel__toggle-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 18px;
  height: 18px;
  border-radius: 999px;
  background: #ffffff;
  transition: transform 0.2s ease;
}

.preferences-panel__toggle--on .preferences-panel__toggle-thumb {
  transform: translateX(18px);
}
</style>
