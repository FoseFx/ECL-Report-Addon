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

  it('should register escape-key listener', () => {
    //
    // set up mock
    //
    const closeSpy = jest.fn();
    // @ts-ignore
    wrapper.vm.close = closeSpy;

    // set visible = true and dispatch escape-key-event
    wrapper.setProps({visible: true});
    const escEvent = new KeyboardEvent('keydown', {key: 'Escape'});
    window.dispatchEvent(escEvent);

    // should close
    expect(closeSpy).toHaveBeenCalled();

    closeSpy.mockReset();

    // set visible = false and dispatch event
    wrapper.setProps({visible: false});
    window.dispatchEvent(escEvent);
    expect(closeSpy).not.toHaveBeenCalled(); // should not trigger when closed

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

    wrapper.setData({tab: 1, stageTwo: false, done: false, error: ''});
    wrapper.find(MajorForm).vm.$emit('submitted', {
      emailReport: false,
        data: {
          why: 'idk',
          subject: 'it happened, ok?',
          additionalLinksData: 'http://please/belive.me?ok=yes',
        },
    });
  });
  it('should close', () => {

    wrapper.setData({tab: 1, stageTwo: true, done: true, error: 'some error message'});
    // @ts-ignore
    wrapper.vm.close();
    expect(wrapper.vm.$data.tab).toEqual(0);
    expect(wrapper.vm.$data.stageTwo).toEqual(false);
    expect(wrapper.vm.$data.done).toEqual(false);
    expect(wrapper.vm.$data.error).toEqual('');

  });

  it('should add listeners', () => {
    // @ts-ignore
    wrapper.vm.addListeners();
    document.dispatchEvent(new CustomEvent('ecl_report_addon_fetch_failed', {detail: 'some error'}));
    expect(wrapper.vm.$data.error).toEqual('some error');
    expect(wrapper.vm.$data.done).toEqual(true);


    // should remove
    document.dispatchEvent(new CustomEvent('ecl_report_addon_fetch_failed', {detail: 'some other error'}));
    expect(wrapper.vm.$data.error).not.toEqual('some other error');


    // @ts-ignore
    wrapper.vm.addListeners();
    document.dispatchEvent(new CustomEvent('ecl_report_addon_fetch_success'));
    expect(wrapper.vm.$data.error).toEqual('');
    expect(wrapper.vm.$data.done).toEqual(true);
  });
});


