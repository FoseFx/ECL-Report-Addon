// @ts-ignore
window.browser = {runtime: {onMessage: {addListener: () => {}}}, tabs: {sendMessage: (...args) => args, query: () => Promise.resolve([{id: 1}])}};
import {obj} from './msg_broker';

it('should exec', () => {
  expect(obj.handleMsg).toBeTruthy();
});

it('should handleMsg', async () => {
  const old = obj.handleQueryBuilt;
  const old2 = obj.uploadToImgur;
  obj.handleQueryBuilt = () => Promise.resolve('test ok');
  obj.uploadToImgur = () => Promise.resolve(['test ok']);

  const resp1 = obj.handleMsg({type: 'REQUEST_REQUEST'});
  expect(resp1).toBe(undefined);

  const resp2 = await obj.handleMsg({type: 'BUILT_QUERY'});
  expect(resp2).toEqual('test ok');

  const resp3 = await obj.handleMsg({type: 'IMGUR_UPLOAD'});
  expect(resp3).toEqual(['test ok']);

  obj.handleQueryBuilt = old;
  obj.uploadToImgur = old2;

});

it('should handleQueryBuilt', async () => {
  const old = obj.sendMsgToECL;
  obj.sendMsgToECL = () => Promise.resolve('test is ok');

  expect(await obj.handleQueryBuilt(undefined)).toEqual('test is ok');

  obj.sendMsgToECL = old;

});

it('should send msg to ecl', async () => {
  // @ts-ignore
  expect(await obj.sendMsgToECL('mock lmao')).toEqual([1, 'mock lmao']);
});

it('should uploadToImgur', async () => {
  window.fetch = jest.fn().mockImplementation((url, opts) => {
    expect(url).toEqual('https://api.imgur.com/3/image');
    expect(opts.method).toEqual('POST');
    expect(opts.headers).toEqual({
      Authorization: 'Client-ID 5d7cf2731f6b345',
      Origin: 'https://api.imgur.com/',
      Accept: 'application/json'
    });
    expect(opts.body.get('image')).toEqual('theBas64StringOfTheFile');
    expect(opts.body.get('type')).toEqual('base64');
    expect(opts.body.get('name')).toEqual('theNameOfTheFile.lol');
    expect(opts.body.get('title')).toEqual('Image uploaded by the ECL-Report-Addon');
    return Promise.resolve({json: () => Promise.resolve({data: {link: 'https://test.tld'}})});
  });

  const res = await obj.uploadToImgur([{base64: 'theBas64StringOfTheFile', name: 'theNameOfTheFile.lol'}]);

  expect(res).toEqual(['https://test.tld']);
});

