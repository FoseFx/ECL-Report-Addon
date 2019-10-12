import { Wrapper, createLocalVue, shallowMount } from '@vue/test-utils';
import MajorForm from '@/components/MajorForm.vue';
import vuetify from '@/plugins/vuetify';

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
        wrapper.vm.uploadToImgur = (files) => Promise.resolve(['https://uploaded.test']);

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

    it('should uploadToImgur', async () => {
        const fakeFile = new File(['ctnt'], 'fileone.png');
        // @ts-ignore
        window.fetch = jest.fn().mockReturnValue(Promise.resolve({json: () => Promise.resolve({link: 'test.com'})}));
        // @ts-ignore
        const resp = await wrapper.vm.uploadToImgur([fakeFile]);

        expect(resp).toEqual(['test.com']);
        // @ts-ignore
        const args = window.fetch.mock.calls[0];
        const opts = args[1];
        const body = opts.body as FormData;

        for (const key of body.keys()) {
            if (key === 'image') {
                expect(body.get(key)).toEqual(fakeFile);
            } else if (key === 'type') {
                expect(body.get(key)).toEqual('file');
            } else if (key === 'name') {
                expect(body.get(key)).toEqual('fileone.png');
            } else if (key === 'title') {
                expect(body.get(key)).toEqual('Image uploaded by the ECL-Report-Addon');
            }
        }

        expect(window.fetch).toHaveBeenCalled();
    });


});


