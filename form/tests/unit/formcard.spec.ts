import { shallowMount } from '@vue/test-utils';
import FormCard from '@/components/FormCard.vue';


describe('FormCard', () => {
  it('should test', () => {
    expect(true).toBe(true);
  });

  it('should render name and div passed', () => {
    const wrapper = shallowMount(
      FormCard, {
      propsData: { division: 3 },
    });
    expect(wrapper.text()).toContain('Division: 3');

  });
});


