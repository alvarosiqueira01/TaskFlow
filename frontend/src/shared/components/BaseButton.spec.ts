import { mount } from '@vue/test-utils';
import BaseButton from './BaseButton.vue';

describe('BaseButton.vue', () => {
  it('renders default slot content', () => {
    const wrapper = mount(BaseButton, {
      slots: {
        default: 'Click Me',
      },
    });

    expect(wrapper.text()).toContain('Click Me');
  });

  it('emits click event when not disabled or loading', async () => {
    const wrapper = mount(BaseButton);
    
    await wrapper.trigger('click');
    
    expect(wrapper.emitted()).toHaveProperty('click');
  });

  it('disables the button when the loading prop is passed', async () => {
    const wrapper = mount(BaseButton, {
      props: {
        loading: true,
      },
    });

    const button = wrapper.find('button');
    expect(button.attributes('disabled')).toBeDefined();
    
    await button.trigger('click');
    expect(wrapper.emitted('click')).toBeUndefined();
  });

  it('applies block styling when block prop is true', () => {
    const wrapper = mount(BaseButton, {
      props: {
        block: true,
      },
    });

    // Validating against generic utility classes expected in tailwind config
    expect(wrapper.classes()).toContain('w-full');
  });
});