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

    it('should proof', () => {
        const data = wrapper.vm.$data;

        const {proofRules} = data;

        expect(proofRules[0]('')).toEqual('Proof required');
        expect(proofRules[0]('some val')).toEqual(true);

        expect(proofRules[1]('some val')).toEqual('Not a valid URL');
        expect(proofRules[1]('https://imgur.com/a/9bvgOzv')).toEqual(true);

    });

    it('should submit', () => {
        wrapper.setData({
            valid: true,
            why: 'toxic',
            subject: 'some subject some subject some subject some subject some subject',
            additionalLinksData: [{links: 'https://nice.acme'}],
            emailReport: false,
        });
        // @ts-ignore
        wrapper.vm.$refs.form = {validate: () => {}};
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


