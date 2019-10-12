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

    it('should calc base64 of file', async () => {
        // @ts-ignore
        const res = await wrapper.vm.fileToBase64(new File(['some test string'], 'somefile.png'));
        expect(res).toEqual(btoa('some test string'));
    });

    it('should upload to imgur', async () => {
        const mockFiles = [new File(['content'], 'test.png')];

        const addLnMock = jest.fn();
        document.addEventListener = addLnMock;
        const rmLnMock = jest.fn();
        document.removeEventListener = rmLnMock;
        const dispEvMock = jest.fn();
        document.dispatchEvent = dispEvMock;

        addLnMock.mockImplementation((type, func) => {
            if (type === 'ecl_report_addon_imgur_upload_result') {
                func({detail: 'some detail'});
            }
        });

        // @ts-ignore
        const res = await wrapper.vm.uploadToImgur(mockFiles);

        expect(res).toEqual('some detail');

        expect(addLnMock).toHaveBeenCalledTimes(2);
        expect(rmLnMock).toHaveBeenCalledTimes(2);
        expect(dispEvMock).toHaveBeenCalledTimes(1);

        
        expect(dispEvMock.mock.calls[0][0].type).toEqual('ecl_report_addon_imgur_upload');
        expect(dispEvMock.mock.calls[0][0].detail).toEqual([{base64: 'Y29udGVudA==', name: 'test.png'}]);

        addLnMock.mockImplementation((type, func) => {
            if (type === 'ecl_report_addon_imgur_upload_result_error') {
                func({detail: 'some error'});
            }
        });

        // @ts-ignore
        await wrapper.vm.uploadToImgur(mockFiles)
            .then((_: any) => expect(false).toEqual(true)) // should not execute this
            .catch((e: any) => {
                expect(e).toEqual('some error');
            });
    });

});


