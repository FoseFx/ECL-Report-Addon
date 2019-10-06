import { Wrapper, createLocalVue, shallowMount } from '@vue/test-utils';
import DropComponent from '@/components/Proof/Drop.vue';
import vuetify from 'vuetify';

describe('DropComponent', () => {
  let wrapper: Wrapper<DropComponent>;
  beforeEach(() => {
    const localVue = createLocalVue();
    localVue.use(vuetify);

    wrapper = shallowMount(
      DropComponent,
      {
        localVue,
      },
    );
  });

  it('should test', () => {
    expect(true).toBe(true);
  });

  it('should preventDefaultAndBubbling', () => {
        const eventMock = {
            preventDefault: jest.fn(),
            stopPropagation: jest.fn(),
        };
        // @ts-ignore
        wrapper.vm.preventDefaultAndBubbling(eventMock);

        expect(eventMock.preventDefault).toHaveBeenCalled();
        expect(eventMock.stopPropagation).toHaveBeenCalled();
    });
  it('should setDraging', () => {
        // @ts-ignore
        wrapper.vm.preventDefaultAndBubbling = jest.fn();
        wrapper.setData({isDraging: false});

        // @ts-ignore
        wrapper.vm.setDraging({});

        expect(wrapper.vm.$data.isDraging).toEqual(true);

        // @ts-ignore
        expect(wrapper.vm.preventDefaultAndBubbling).toHaveBeenCalled();
    });

  it('should removeDraging', () => {
        // @ts-ignore
        wrapper.vm.preventDefaultAndBubbling = jest.fn();
        wrapper.setData({isDraging: true});

        // @ts-ignore
        wrapper.vm.removeDraging({});

        expect(wrapper.vm.$data.isDraging).toEqual(false);

        // @ts-ignore
        expect(wrapper.vm.preventDefaultAndBubbling).toHaveBeenCalled();
    });

  it('should handle inputSelected', () => {
        const afterSelectMock = jest.fn();
        // @ts-ignore
        wrapper.vm.afterSelect = afterSelectMock;

        const eventMock = {target: {files: ['a']}};
          // @ts-ignore
        wrapper.vm.inputSelected(eventMock);

        expect(afterSelectMock.mock.calls[0][0]).toEqual(['a']);
        });
  it('should drop', () => {
        const afterSelectMock = jest.fn();
        const pdabMock = jest.fn();
        // @ts-ignore
        wrapper.vm.afterSelect = afterSelectMock;
        // @ts-ignore
        wrapper.vm.preventDefaultAndBubbling = pdabMock;

        // @ts-ignore
        wrapper.vm.drop({dataTransfer: null});
        expect(pdabMock).not.toHaveBeenCalled();
        expect(afterSelectMock).not.toHaveBeenCalled();



        const eventMock = {dataTransfer: {files: ['a']}};
        // @ts-ignore
        wrapper.vm.drop(eventMock);

        expect(pdabMock).toHaveBeenCalled();
        expect(afterSelectMock.mock.calls[0][0]).toEqual(['a']);
    });

  it('should handle afterSelect', () => {
        wrapper.setData({stagingFiles: null, filename: '', hasSelected: false});
        // @ts-ignore
        wrapper.vm.afterSelect(null);
        expect(wrapper.vm.$data.hasSelected).toEqual(false);


        // @ts-ignore
        wrapper.vm.afterSelect([]);
        expect(wrapper.vm.$data.hasSelected).toEqual(false);


        // @ts-ignore
        wrapper.vm.afterSelect([{name: 'a'}]);
        expect(wrapper.vm.$data.filename).toEqual('a');

        // @ts-ignore
        wrapper.vm.afterSelect(['a', 'b', 'c']);
        expect(wrapper.vm.$data.filename).toEqual('3 items');

        expect(wrapper.vm.$data.stagingFiles).toEqual(['a', 'b', 'c']);

    });

  it('should return whether MIME of file is allowed', () => {
      // @ts-ignore
      expect(wrapper.vm.isAllowedMime({type: 'image/lmao'})).toEqual(false);
      // @ts-ignore
      expect(wrapper.vm.isAllowedMime({type: 'image/jpeg'})).toEqual(true);
    });

  it('should return whether component is valid', () => {
    wrapper.setData({stagingFiles: null, filename: '', hasSelected: false});
    // @ts-ignore
    expect(wrapper.vm.valid()).toEqual(false);

    // @ts-ignore
    wrapper.vm.isAllowedMime = (_) => false;
    wrapper.setData({stagingFiles: [{type: 's'}], filename: '', hasSelected: true});
    // @ts-ignore
    expect(wrapper.vm.valid()).toEqual(false);

    // @ts-ignore
    wrapper.vm.isAllowedMime = (_) => true;
    wrapper.setData({stagingFiles: [{type: 's'}], filename: '', hasSelected: true});
    // @ts-ignore
    expect(wrapper.vm.valid()).toEqual(true);
  });

});
