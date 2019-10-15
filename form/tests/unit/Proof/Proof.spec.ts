import { Wrapper, createLocalVue, shallowMount } from '@vue/test-utils';
import ProofComponent from '@/components/Proof/Proof.vue';
import vuetify from 'vuetify';

describe('Proof', () => {
  let wrapper: Wrapper<ProofComponent>;
  beforeEach(() => {
    const localVue = createLocalVue();
    localVue.use(vuetify);
    wrapper = shallowMount(
      ProofComponent,
      {
        localVue,
      },
    );
  });
  it('should compute valid', () => {
    wrapper.setData({mode: 0, imgurValid: true});

    // @ts-ignore
    expect(wrapper.vm.valid()).toEqual(true);

    wrapper.setData({mode: 1, urlValue: 'https://somehost/some/path/and?query=params'});

    // @ts-ignore
    expect(wrapper.vm.valid()).toEqual(true);
  });
  it('should compute dirty', () => {
    wrapper.setData({mode: 0, imgurDirty: false});
    // @ts-ignore
    expect(wrapper.vm.dirty()).toEqual(false);

    wrapper.setData({mode: 1, urldirty: true});
    // @ts-ignore
    expect(wrapper.vm.dirty()).toEqual(true);
  });

  it('should setImgurValid', () => {
    wrapper.setData({mode: 0, imgurValid: false});
    // @ts-ignore
    wrapper.vm.setImgurValid(true);
    // @ts-ignore
    expect(wrapper.vm.valid()).toEqual(true);
  });

  it('should setImgurDirty', () => {
    wrapper.setData({mode: 0, imgurDirty: false});
    // @ts-ignore
    wrapper.vm.setImgurDirty(true);
    // @ts-ignore
    expect(wrapper.vm.dirty()).toEqual(true);
  });

  it('should proof', () => {
    const data = wrapper.vm.$data;

    const {proofRules} = data;

    expect(proofRules[0]('')).toEqual('Proof required');
    expect(proofRules[0]('some val')).toEqual(true);

    expect(proofRules[1]('some val')).toEqual('Not a valid URL');
    expect(proofRules[1]('https://imgur.com/a/9bvgOzv')).toEqual(true);

  });
});
