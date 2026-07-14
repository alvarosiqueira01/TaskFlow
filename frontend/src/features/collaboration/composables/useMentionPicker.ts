import { ref } from 'vue';

/**
 * The API contract has no user directory/search endpoint, so mentions
 * are tracked as manually entered user UUIDs rather than a searchable
 * @-mention autocomplete. A "list/search users" endpoint would allow
 * upgrading this to a proper picker without changing the public
 * surface of this composable.
 */
export function useMentionPicker(initialMentions: string[] = []) {
  const mentions = ref<string[]>([...initialMentions]);

  function addMention(userId: string) {
    const trimmed = userId.trim();
    if (!trimmed || mentions.value.includes(trimmed)) return;
    mentions.value = [...mentions.value, trimmed];
  }

  function removeMention(userId: string) {
    mentions.value = mentions.value.filter((id) => id !== userId);
  }

  function reset() {
    mentions.value = [];
  }

  return { mentions, addMention, removeMention, reset };
}
