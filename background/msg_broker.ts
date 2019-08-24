import {Report} from '../form/src/types';

interface MsgRequest<T> {
    type: 'BUILT_QUERY'|'REQUEST_REQUEST';
    data?: T;
}

export const obj =  {

    handleMsg: (req: MsgRequest<Report>) => {
        console.log('bg: handleMsg', req, obj);
        switch (req.type) {
            case 'BUILT_QUERY': return obj.handleQueryBuilt(req.data);
            default:
        }
    },
    handleQueryBuilt: async (data: Report) => {
        return obj.sendMsgToECL({type: 'REQUEST_REQUEST', data}) as Promise<boolean|string>;
    },
    sendMsgToECL: async (req: MsgRequest<Report>) => {
        console.log('sendMsgToECL', req);
        // @ts-ignore
        const tabs = await browser.tabs.query({
            active: true
        });
        // @ts-ignore
        return browser.tabs.sendMessage(tabs[0].id, req) as Promise<any>;
    }

};

// @ts-ignore
browser.runtime.onMessage.addListener(
    obj.handleMsg
);

