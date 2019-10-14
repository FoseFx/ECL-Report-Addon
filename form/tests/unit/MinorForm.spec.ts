import { Wrapper, createLocalVue, shallowMount } from '@vue/test-utils';
import MinorForm from '@/components/MinorForm.vue';
import vuetify from '@/plugins/vuetify';
import ProofComponent from '@/components/Proof/Proof.vue';
import * as imgur from '@/imgur';

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

    it('it should select right submit function', async () => {
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
        wrapper.vm.$refs.proofs = [{valid: () => true}];
        // @ts-ignore
        await wrapper.vm.onSubmit();
        expect(inGSpy).not.toHaveBeenCalled();
        expect(mrSpy).toHaveBeenCalled();
        inGSpy.calls.reset();
        mrSpy.calls.reset();
        wrapper.setData({where: 'in-game', valid: true, offenceInvalid: false});
        // @ts-ignore
        await wrapper.vm.onSubmit();
        expect(inGSpy).toHaveBeenCalled();
        expect(mrSpy).not.toHaveBeenCalled();

        // invalid

        wrapper.setData({where: 'in-game', valid: false, offenceInvalid: false});
        // @ts-ignore
        expect(await wrapper.vm.onSubmit()).toEqual(false);
        wrapper.setData({where: 'in-game', valid: true, offenceInvalid: true});
        // @ts-ignore
        expect(await wrapper.vm.onSubmit()).toEqual(false);

    });

    it('should evalLinks', async () => {
        const d = {drop: {stagingFiles: []}};
        wrapper.vm.$refs.proofs = [
            {mode: 1, urlValue: 'first url'},
            {mode: 0, $refs: d},
            {mode: 0, $refs: d},
        ] as unknown as ProofComponent[];

        // @ts-ignore
        imgur.uploadToImgur = jest.fn()
            .mockResolvedValueOnce(['second url', 'third url'])
            .mockResolvedValueOnce(['another url']);

        // @ts-ignore
        expect(await wrapper.vm.evalLinks()).toEqual(
            {
                proofLink: 'first url',
                additionalLinksData: [
                    {link: 'second url'},
                    {link: 'third url'},
                    {link: 'another url'},
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

    it('should submit ingame', async () => {
        // @ts-ignore
        spyOn(wrapper.vm, 'evalCheckboxes').and.returnValue(['rage']);
        // @ts-ignore
        spyOn(wrapper.vm, 'evalLinks').and.returnValue(
            Promise.resolve({
                proofLink: 'first url',
                additionalLinksData: [
                    {link: 'snd url'},
                    {link: 'third url'},
                ],
            }),
        );
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
        expect(await wrapper.vm.onSubmitInGame()).toEqual(true);

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

    it('should submit matchroom', async () => {
        // @ts-ignore
        spyOn(wrapper.vm, 'evalCheckboxes').and.returnValue(['rage']);
        // @ts-ignore
        spyOn(wrapper.vm, 'evalLinks').and.returnValue(
            Promise.resolve({
                proofLink: 'first url',
                additionalLinksData: [
                    {link: 'snd url'},
                    {link: 'third url'},
                ],
            }),
        );

        wrapper.vm.$refs.form = {
            reset: () => ({}),
        } as unknown as MinorForm;
        wrapper.setData({
            where: 'matchroom-chat',
        });
        // @ts-ignore
        expect(await wrapper.vm.onSubmitMatchroom()).toEqual(true);

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


