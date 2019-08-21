import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import FormCard from '@/components/FormCard.vue';
import MajorForm from '@/components/MajorForm.vue';
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

  it('should submit', () => {
    wrapper.setData({tab: 0});
    wrapper.find(MajorForm).vm.$emit('submitted', {
      emailReport: false,
        data: {
          why: 'idk',
          subject: 'it happened, ok?',
          additionalLinksData: 'http://please/belive.me?ok=yes',
        },
    });

    wrapper.setData({tab: 1});
    wrapper.find(MajorForm).vm.$emit('submitted', {
      emailReport: false,
        data: {
          why: 'idk',
          subject: 'it happened, ok?',
          additionalLinksData: 'http://please/belive.me?ok=yes',
        },
    });
  });
});


