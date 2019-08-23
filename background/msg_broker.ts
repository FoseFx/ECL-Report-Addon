import {Report} from '../form/src/types';

interface MsgRequest<T> {
    type: 'BUILT_QUERY'|'REQUEST_REQUEST';
    data?: T;
}


// @ts-ignore
browser.runtime.onMessage.addListener(
    handleMsg
);
export function handleMsg(req: MsgRequest<Report>): Promise<MsgRequest<any>> {
    console.log('bg: handleMsg', req);
    switch (req.type) {
        case 'BUILT_QUERY': return handleQueryBuilt(req.data);
        default:
    }
}
export async function handleQueryBuilt(data: Report): Promise<MsgRequest<boolean|string>> {
    console.log('handleQueryBuilt', data);
    return sendMsgToECL({type: 'REQUEST_REQUEST', data});
}
export async function sendMsgToECL(req: MsgRequest<Report>): Promise<any> {
    console.log('sendMsgToECL', req);
    // @ts-ignore
    return browser.runtime.sendMessage(req);
}
