import { Wrapper, createLocalVue, shallowMount } from '@vue/test-utils';
import MinorForm from '@/components/MinorForm.vue';
import vuetify from '@/plugins/vuetify';

describe('MinorForm.vue', () => {

    let wrapper: Wrapper<MinorForm>;

    beforeEach(() => {
        const localVue = createLocalVue();
        localVue.use(vuetify);

        wrapper = shallowMount(
            MinorForm,
            {
                localVue,
            },
        );
    });

    it('should mount', () => {
        expect(wrapper).toBeTruthy();
    });

    it('shoud rule on URLs', () => {
        const data = wrapper.vm.$data;
        const {urlRules} = data;
        expect(urlRules[0]('')).toEqual('When added it must be filled out');
        expect(urlRules[0]('some val')).toEqual(true);

        expect(urlRules[1]('some val')).toEqual('Not a valid URL');
        expect(urlRules[1]('https://imgur.com/a/9bvgOzv')).toEqual(true);
    });

    it('should it should select right submit function', () => {
        // @ts-ignore
        const inGSpy = spyOn(wrapper.vm, 'onSubmitInGame');
        wrapper.setData({where: 'matchroom-chat'});
        // @ts-ignore
        wrapper.vm.onSubmit();
        expect(inGSpy).not.toHaveBeenCalled();
        wrapper.setData({where: 'in-game'});
        // @ts-ignore
        wrapper.vm.onSubmit();
        expect(inGSpy).toHaveBeenCalled();
    });

    it('should submit ingame', () => {
        // @ts-ignore
        spyOn(wrapper.vm, 'evalCheckboxes').and.returnValue(['rage']);
        wrapper.vm.$refs.form = {
            validate: () => ({}),
            reset: () => ({}),
        } as unknown as MinorForm;

        // invalid form
        wrapper.setData({offenceInvalid: false, valid: false});
        // @ts-ignore
        expect(wrapper.vm.onSubmitInGame()).toEqual(false);

        // invalid checkboxes
        wrapper.setData({offenceInvalid: true, valid: true});
        // @ts-ignore
        expect(wrapper.vm.onSubmitInGame()).toEqual(false);

        // valid
        wrapper.setData({
            where: 'in-game',
            offenceInvalid: false,
            valid: true,
            proof: ['first url', 'snd url', 'third url'],
            additionalData: [
                {additionalDataRound: '1', additionalDataDetail: 'some descr'},
                {additionalDataRound: '2', additionalDataDetail: 'some other descr'},
            ],
        });
        // @ts-ignore
        expect(wrapper.vm.onSubmitInGame()).toEqual(true);

        expect(wrapper.emitted('submitted')).toEqual([
            [
                {
                    data: {
                        where: 'in-game',
                        offences: ['rage'],
                        proofLink: 'first url',
                        additionalLinksData: [
                            {link: 'snd url'},
                            {link: 'third url'},
                        ],
                        additionalData: [
                            {round: 1, description: 'some descr'},
                            {round: 2, description: 'some other descr'},
                        ],
                    },
                },
            ],
        ]);
    });

    it('should evalCkeckboxes', () => {
        wrapper.setData({offences: {
            rage: true,
            somethingelse: false,
        }});
        // @ts-ignore
        expect(wrapper.vm.evalCheckboxes()).toEqual(['rage']);
        expect(wrapper.vm.$data.offenceInvalid).toEqual(false);
        wrapper.setData({offences: {
            rage: false,
            somethingelse: false,
        }});
        // @ts-ignore
        expect(wrapper.vm.evalCheckboxes()).toEqual([]);
        expect(wrapper.vm.$data.offenceInvalid).toEqual(true);
        
    });
});


