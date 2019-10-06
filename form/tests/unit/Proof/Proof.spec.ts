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
        wrapper.setData({mode: 0, imgurValid: false});

        // @ts-ignore
        expect(wrapper.vm.valid()).toEqual(false);
    });
    it('should compute dirty', () => {
        wrapper.setData({mode: 0, imgurDirty: false});
        // @ts-ignore
        expect(wrapper.vm.dirty()).toEqual(false);
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
});
