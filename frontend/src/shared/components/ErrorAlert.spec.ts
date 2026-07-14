import { mount } from '@vue/test-utils';
import ErrorAlert from './ErrorAlert.vue';

describe('ErrorAlert.vue', () => {
  it('renders the provided error message', () => {
    const wrapper = mount(ErrorAlert, {
      props: {
        message: 'Invalid credentials provided.',
      },
    });

    expect(wrapper.text()).toContain('Invalid credentials provided.');
    expect(wrapper.attributes('role')).toBe('alert');
  });
});