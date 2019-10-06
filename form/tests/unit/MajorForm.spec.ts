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


    it('should submit', () => {
        wrapper.setData({
            valid: true,
            why: 'toxic',
            subject: 'some subject some subject some subject some subject some subject',
            additionalLinksData: [{links: 'https://nice.acme'}],
            emailReport: false,
        });
        let validateCalled = false;
        let resetCalled = false;

        wrapper.vm.$refs.form = {
            validate: () => validateCalled = true,
            reset: () => resetCalled = true,
        } as unknown as MajorForm;

        const button = wrapper.find('.save-btn');
        button.vm.$emit('click');

        expect(wrapper.emitted('submitted')).toEqual([[
            {
                emailReport: false,
                data: {
                    additionalLinksData: [
                        {links: 'https://nice.acme'},
                    ],
                    subject: 'some subject some subject some subject some subject some subject',
                    why: 'toxic',
                },
            },
        ]]);
        expect(validateCalled).toBe(true);
        expect(resetCalled).toBe(true);
        wrapper.setData({
            valid: false,
            why: 'toxic',
            subject: '',
            additionalLinksData: [{links: ''}],
            emailReport: true,
        });

        button.vm.$emit('click');

        expect(wrapper.emitted('submitted').length).toEqual(1); // no new event

    });


});


