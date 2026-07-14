import { mount } from '@vue/test-utils';
import UserRoleEditor from './UserRoleEditor.vue';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('UserRoleEditor.vue', () => {
  it('emits a saved payload containing only the checked role IDs', async () => {
    const wrapper = mount(UserRoleEditor, {
      props: {
        userId: 'user-123',
        availableRoles: [
          { id: 'r1', name: 'ADMIN' },
          { id: 'r2', name: 'USER' }
        ],
        assignedRoles: [{ id: 'r2', name: 'USER' }],
        loading: false,
        loadError: null,
        saving: false,
        saveError: null,
        saveFieldErrors: [],
        saveSuccess: false,
      }
    });

    // The component should pre-check 'r2'
    const checkboxes = wrapper.findAll('input[type="checkbox"]');
    expect((checkboxes[1].element as HTMLInputElement).checked).toBe(true);

    // Check 'r1'
    await checkboxes[0].setValue(true);

    // Submit form
    await wrapper.find('form').trigger('submit.prevent');

    const emitted = wrapper.emitted('save');
    expect(emitted).toBeTruthy();
    expect(emitted?.[0][0]).toEqual(['r1', 'r2']);
  });
});
