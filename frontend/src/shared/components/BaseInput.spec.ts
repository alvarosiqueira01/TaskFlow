import { mount } from '@vue/test-utils';
import BaseInput from './BaseInput.vue';

describe('BaseInput.vue', () => {
  it('renders with the correct html attributes', () => {
    const wrapper = mount(BaseInput, {
      props: {
        id: 'test-input',
        type: 'email',
        placeholder: 'Enter email',
        modelValue: '',
      },
    });

    const input = wrapper.find('input');
    expect(input.attributes('id')).toBe('test-input');
    expect(input.attributes('type')).toBe('email');
    expect(input.attributes('placeholder')).toBe('Enter email');
  });

  it('emits update:modelValue when the user types', async () => {
    const wrapper = mount(BaseInput, {
      props: {
        modelValue: '',
      },
    });

    const input = wrapper.find('input');
    await input.setValue('new value');

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['new value']);
  });

  it('applies an invalid class or attribute when the invalid prop is true', () => {
    const wrapper = mount(BaseInput, {
      props: {
        modelValue: '',
        invalid: true,
      },
    });

    // Assuming your implementation binds an aria-invalid attribute or specific class
    const input = wrapper.find('input');
    expect(input.attributes('aria-invalid')).toBe('true');
  });
});