// @ts-ignore
window.browser = {runtime: {onMessage: {addListener: () => {}}}, tabs: {sendMessage: (...args) => args, query: () => Promise.resolve([{id: 1}])}};
import {obj} from './msg_broker';

it('should exec', () => {
    expect(obj.handleMsg).toBeTruthy();
});

it('should handleMsg', async () => {
    const old = obj.handleQueryBuilt;
    obj.handleQueryBuilt = () => Promise.resolve('test ok');

    const resp1 = obj.handleMsg({type: 'REQUEST_REQUEST'});
    expect(resp1).toBe(undefined);

    const resp2 = await obj.handleMsg({type: 'BUILT_QUERY'});
    expect(resp2).toEqual('test ok');

    obj.handleQueryBuilt = old;

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

