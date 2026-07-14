import { mount } from '@vue/test-utils';
import ChangePasswordForm from './ChangePasswordForm.vue';
import { describe, expect, it, vi } from 'vitest';

describe('ChangePasswordForm.vue', () => {
  it('disables the submit button and shows an error if passwords do not match', async () => {
    const wrapper = mount(ChangePasswordForm, {
      props: {
        saving: false,
        error: null,
        fieldErrors: [],
        success: false,
      }
    });

    const inputs = wrapper.findAll('input[type="password"]');
    
    // newPassword input
    await inputs[1].setValue('password123');
    // confirmPassword input
    await inputs[2].setValue('password999');

    expect(wrapper.text()).toContain('Passwords do not match.');

    const submitButton = wrapper.find('button[type="submit"]');
    expect(submitButton.attributes('disabled')).toBeDefined();
    
    await wrapper.find('form').trigger('submit.prevent');
    expect(wrapper.emitted('submit')).toBeUndefined();
  });
});
