import {fileToBase64, uploadToImgur} from '@/imgur';

describe('Imgur', () => {
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
        const res = await uploadToImgur(mockFiles);

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
        await uploadToImgur(mockFiles)
            .then((_: any) => expect(false).toEqual(true)) // should not execute this
            .catch((e: any) => {
                expect(e).toEqual('some error');
        });
    });
    it('should calc base64 of file', async () => {
        const res = await fileToBase64(new File(['some test string'], 'somefile.png'));
        expect(res).toEqual(btoa('some test string'));
    });
});
