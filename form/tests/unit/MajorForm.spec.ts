import { Wrapper, createLocalVue, shallowMount } from '@vue/test-utils';
import MajorForm from '@/components/MajorForm.vue';
import vuetify from '@/plugins/vuetify';
import * as imgur from '@/imgur';

describe('MajorForm.vue', () => {

    let wrapper: Wrapper<MajorForm>;

    beforeEach(() => {
        const localVue = createLocalVue();
        localVue.use(vuetify);

        wrapper = shallowMount(
            MajorForm,
            {
                localVue,
            },
        );
    });

    it('should mount', () => {
        expect(wrapper).toBeTruthy();
    });

    it('should block submit when blockEverything is on', async () => {
        const stub = jest.fn();

        // @ts-ignore
        wrapper.vm.$refs.form = {validate: stub};

        /* Valid Form Data */
        wrapper.setData({
            valid: true,
            why: 'toxic',
            subject: 'some subject some subject some subject some subject some subject',
            emailReport: false,
            blockEverything: true,
        });
        // @ts-ignore
        await wrapper.vm.onSubmit();

        expect(stub).not.toHaveBeenCalled();
    });

    it('should submit', async () => {
        /* Valid Form Data */
        wrapper.setData({
            valid: true,
            why: 'toxic',
            subject: 'some subject some subject some subject some subject some subject',
            emailReport: false,
        });

        /* Stub some valid Dropped Files */

        // @ts-ignore
        wrapper.vm.$refs.proofs = [{
            // @ts-ignore
            valid: () => true,
            urlValue: 'https://nice.acme',
            mode: 1,
        }, {
            valid: () => true,
            mode: 0,
            $refs: {
                drop: {
                    stagingFiles: [/* We stub this in the upload function */],
                },
            },
        }];

        /* Stub uploading */
        // @ts-ignore
        imgur.uploadToImgur = (files: any) => Promise.resolve(['https://uploaded.test']);

        /* Values will change when everything works */
        let validateCalled = false;
        let resetCalled = false;

        /* Stub validation functions */
        wrapper.vm.$refs.form = {
            validate: () => validateCalled = true,
            reset: () => resetCalled = true,
        } as unknown as MajorForm;

        // @ts-ignore
        await wrapper.vm.onSubmit();

        /* Expect */
        expect(wrapper.emitted('submitted')).toEqual([[
            {
                emailReport: false,
                data: {
                    additionalLinksData: [
                        {links: 'https://nice.acme'},
                        {links: 'https://uploaded.test'},
                    ],
                    subject: 'some subject some subject some subject some subject some subject',
                    why: 'toxic',
                },
            },
        ]]);
        expect(validateCalled).toBe(true); // make sure valid() has been called
        expect(resetCalled).toBe(true); // // make sure reset() has been called

        /* Set some invalid form data */
        wrapper.setData({
            valid: false,
            why: 'toxic',
            subject: '',
            additionalLinksData: [{links: ''}],
            emailReport: true,
        });

        // @ts-ignore
        await wrapper.vm.onSubmit();

        expect(wrapper.emitted('submitted').length).toEqual(1); // no new event

    });

    it('should handle imgurUpload error in submit', async () => {
        /* Valid Form Data */
        wrapper.setData({
            valid: true,
            why: 'toxic',
            subject: 'some subject some subject some subject some subject some subject',
            emailReport: false,
            blockeEverything: false,
        });

        // @ts-ignore
        wrapper.vm.$refs.form = {validate: () => undefined, valid: () => true};

        // @ts-ignore
        wrapper.vm.$refs.proofs = [{valid: () => true, mode: 0, $refs: {drop: {stagingFiles: []}}}];

        // @ts-ignore
        imgur.uploadToImgur = () => Promise.reject('Some Error');

        // @ts-ignore
        await wrapper.vm.onSubmit();

        expect(wrapper.emitted('submitted')).toEqual(undefined); // no new event
    });
});


