/**
 * shared/directives/autofocus.directive.ts
 *
 * `v-autofocus` — focuses the bound element as soon as it is mounted.
 * Used on the first field of forms, `ConfirmationDialog` action
 * buttons, and drawer/modal entry points, per
 * `UI-UX-guidelines.md` section 16 ("Keyboard navigation") and
 * section 26 (Accessibility — focus management).
 */

import type { Directive } from 'vue';

export const vAutofocus: Directive<HTMLElement, boolean | undefined> = {
  mounted(el, binding) {
    if (binding.value === false) return;

    // Deferred to the next tick so the element is fully painted/visible
    // (important inside transitions like the Task Details drawer).
    requestAnimationFrame(() => el.focus());
  },
};
