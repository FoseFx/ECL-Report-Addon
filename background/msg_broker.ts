import {Report} from '../form/src/types';

interface MsgRequest<T> {
  type: 'BUILT_QUERY'|'REQUEST_REQUEST'|'IMGUR_UPLOAD';
  data?: T;
}

declare let browser: any;

export const obj =  {

  handleMsg: (req: MsgRequest<any>) => {
    console.log('bg: handleMsg', req, obj);
    switch (req.type) {
      case 'BUILT_QUERY': return obj.handleQueryBuilt(req.data);
      case 'IMGUR_UPLOAD': return obj.uploadToImgur(req.data);
      default:
        console.log('default hit');

    }
  },
  handleQueryBuilt: async (data: Report) => {
    return obj.sendMsgToECL({type: 'REQUEST_REQUEST', data}) as Promise<boolean|string>;
  },
  sendMsgToECL: async (req: MsgRequest<Report>) => {
    console.log('sendMsgToECL', req);
    const tabs = await browser.tabs.query({
      active: true
    });
    return browser.tabs.sendMessage(tabs[0].id, req) as Promise<any>;
  },
  uploadToImgur: async (files: Array<{base64: string, name: string}>) => {
    const array = [];
    for (const file of files) {
      const body = new FormData();
      body.append('image', file.base64);
      body.append('type', 'base64');
      body.append('name', file.name);
      body.append('title', 'Image uploaded by the ECL-Report-Addon');

      const res = await fetch('https://api.imgur.com/3/image', {
        method: 'POST',
        headers: {
          Authorization: 'Client-ID 5d7cf2731f6b345',
          Origin: 'https://api.imgur.com/',
          Accept: 'application/json'
        },
        body,
      });
      const json = await res.json();
      array.push(json.data.link);
    }
    return array;
  }

};

browser.runtime.onMessage.addListener(
  obj.handleMsg
);

