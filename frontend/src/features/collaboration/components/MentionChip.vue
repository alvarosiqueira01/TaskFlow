<script setup lang="ts">
defineProps<{ userId: string; removable?: boolean }>();
const emit = defineEmits<{ (e: 'remove', userId: string): void }>();
</script>

<template>
  <span class="mention-chip">
    @{{ userId }}
    <button
      v-if="removable"
      type="button"
      class="mention-chip__remove"
      :aria-label="`Remove mention ${userId}`"
      @click="emit('remove', userId)"
    >
      ×
    </button>
  </span>
</template>

<style scoped>
.mention-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: var(--color-primary-subtle, #eff6ff);
  color: var(--color-primary, #2563eb);
  border-radius: 999px;
  padding: 2px 8px;
  font-size: 11px;
}

.mention-chip__remove {
  border: none;
  background: none;
  cursor: pointer;
  color: inherit;
  line-height: 1;
  font-size: 12px;
}
</style>
