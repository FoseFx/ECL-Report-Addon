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
        wrapper.vm.$refs.form = {
            validate: () => ({}),
            reset: () => ({}),
        } as unknown as MinorForm;
        // @ts-ignore
        spyOn(wrapper.vm, 'evalCheckboxes');
        // @ts-ignore
        const inGSpy = spyOn(wrapper.vm, 'onSubmitInGame');
        // @ts-ignore
        const mrSpy = spyOn(wrapper.vm, 'onSubmitMatchroom');
        wrapper.setData({where: 'matchroom-chat', valid: true, offenceInvalid: false});
        // @ts-ignore
        wrapper.vm.onSubmit();
        expect(inGSpy).not.toHaveBeenCalled();
        expect(mrSpy).toHaveBeenCalled();
        inGSpy.calls.reset();
        mrSpy.calls.reset();
        wrapper.setData({where: 'in-game', valid: true, offenceInvalid: false});
        // @ts-ignore
        wrapper.vm.onSubmit();
        expect(inGSpy).toHaveBeenCalled();
        expect(mrSpy).not.toHaveBeenCalled();

        // invalid

        wrapper.setData({where: 'in-game', valid: false, offenceInvalid: false});
        // @ts-ignore
        expect(wrapper.vm.onSubmit()).toEqual(false);
        wrapper.setData({where: 'in-game', valid: true, offenceInvalid: true});
        // @ts-ignore
        expect(wrapper.vm.onSubmit()).toEqual(false);

    });

    it('should evalLinks', () => {
        wrapper.setData({proof: ['first url', 'second url', 'third url']});
        // @ts-ignore
        expect(wrapper.vm.evalLinks()).toEqual(
            {
                proofLink: 'first url',
                additionalLinksData: [
                    {link: 'second url'},
                    {link: 'third url'},
                ],
            },
        );
    });

    it('should evalAdditionalData', () => {
        wrapper.setData({additionalData: [
            {
                additionalDataRound: '1',
                additionalDataDetail: 'descr',
            },
        ]});
        // @ts-ignore
        expect(wrapper.vm.evalAdditionalData()).toEqual([
            {round: 1, description: 'descr'},
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

    it('should submit ingame', () => {
        // @ts-ignore
        spyOn(wrapper.vm, 'evalCheckboxes').and.returnValue(['rage']);
        // @ts-ignore
        spyOn(wrapper.vm, 'evalLinks').and.returnValue({
            proofLink: 'first url',
            additionalLinksData: [
                {link: 'snd url'},
                {link: 'third url'},
            ],
        });
        // @ts-ignore
        spyOn(wrapper.vm, 'evalAdditionalData').and.returnValue([
            {round: 1, description: 'some descr'},
            {round: 2, description: 'some other descr'},
        ]);

        wrapper.vm.$refs.form = {
            reset: () => ({}),
        } as unknown as MinorForm;
        wrapper.setData({
            where: 'in-game',
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

    it('should submit matchroom', () => {
        // @ts-ignore
        spyOn(wrapper.vm, 'evalCheckboxes').and.returnValue(['rage']);
        // @ts-ignore
        spyOn(wrapper.vm, 'evalLinks').and.returnValue({
            proofLink: 'first url',
            additionalLinksData: [
                {link: 'snd url'},
                {link: 'third url'},
            ],
        });

        wrapper.vm.$refs.form = {
            reset: () => ({}),
        } as unknown as MinorForm;
        wrapper.setData({
            where: 'matchroom-chat',
        });
        // @ts-ignore
        expect(wrapper.vm.onSubmitMatchroom()).toEqual(true);

        expect(wrapper.emitted('submitted')).toEqual([
            [
                {
                    data: {
                        where: 'matchroom-chat',
                        offences: ['rage'],
                        proofLink: 'first url',
                        additionalLinksData: [
                            {link: 'snd url'},
                            {link: 'third url'},
                        ],
                    },
                },
            ],
        ]);
    });
});


