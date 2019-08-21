import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import FormCard from '@/components/FormCard.vue';
import vuetify from 'vuetify';


describe('FormCard', () => {
  let wrapper: Wrapper<FormCard>;
  beforeEach(() => {
    const localVue = createLocalVue();
    localVue.use(vuetify);

    wrapper = shallowMount(
      FormCard,
      {
        localVue,
      },
    );
  });

  it('should test', () => {
    expect(true).toBe(true);
  });

  it('should render name and div passed', () => {
    wrapper.setProps({
      division: 3,
      reportedName: 'Some Nice n8me',
    });
    expect(wrapper.text()).toContain('Report player \'Some Nice n8me\'');
    expect(wrapper.text()).toContain('Division: 3');
  });
});


