import {Report} from '../form/src/types';

interface MsgRequest<T> {
    type: 'BUILT_QUERY'|'REQUEST_REQUEST';
    data?: T;
}

export class MsgBroker {
    constructor() {
        console.log('initing');
        // @ts-ignore
        browser.runtime.onMessage.addListener(this.handleMessage);
        console.log('listening');
    }
    handleMsg(req: MsgRequest<Report>): Promise<MsgRequest<any>> {
        console.log('bg: handleMsg', req);
        switch (req.type) {
            case 'BUILT_QUERY': return this.handleQueryBuilt(req.data);
            default:
        }
    }
    async handleQueryBuilt(data: Report): Promise<MsgRequest<boolean|string>> {
        console.log('handleQueryBuilt', data);
        return this.sendMsgToECL({type: 'REQUEST_REQUEST', data});
    }
    async sendMsgToECL(req: MsgRequest<Report>): Promise<any> {
        console.log('sendMsgToECL', req);
        // @ts-ignore
        return browser.runtime.sendMessage(req);
    }
}

const i = new MsgBroker();
