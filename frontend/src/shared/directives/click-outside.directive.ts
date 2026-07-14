/**
 * shared/directives/click-outside.directive.ts
 *
 * `v-click-outside="handler"` — invokes `handler` when a pointer event
 * occurs outside the bound element. Used by dropdown menus (`UserMenu`,
 * `BaseSelect`) and popovers to close on outside interaction.
 */

import type { Directive, DirectiveBinding } from 'vue';

type ClickOutsideElement = HTMLElement & { __clickOutsideHandler__?: (event: MouseEvent) => void };

function bindHandler(el: ClickOutsideElement, binding: DirectiveBinding<(event: MouseEvent) => void>): void {
  const handler = (event: MouseEvent): void => {
    if (el === event.target || el.contains(event.target as Node)) {
      return;
    }
    binding.value?.(event);
  };

  el.__clickOutsideHandler__ = handler;
  document.addEventListener('click', handler, true);
}

function unbindHandler(el: ClickOutsideElement): void {
  if (el.__clickOutsideHandler__) {
    document.removeEventListener('click', el.__clickOutsideHandler__, true);
    delete el.__clickOutsideHandler__;
  }
}

export const vClickOutside: Directive<ClickOutsideElement, (event: MouseEvent) => void> = {
  mounted: bindHandler,
  updated(el, binding) {
    unbindHandler(el);
    bindHandler(el, binding);
  },
  unmounted: unbindHandler,
};
