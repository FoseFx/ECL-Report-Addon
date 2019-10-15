export async function uploadToImgur(files: FileList): Promise<string[]> {

  const baseArray: Array<{name: string, base64: string}> = [];

  // tslint:disable-next-line: prefer-for-of
  for (let i = 0; i < files.length; i++) {
    const base64 = await fileToBase64(files[i]);
    const name = files[i].name;
    baseArray.push({name, base64});
  }

  return new Promise((resolve, reject) => {

    function errListener(event: CustomEvent) {
      removeListeners();
      return reject(event.detail);
    }

    function sucListener(event: CustomEvent) {
      removeListeners();
      return resolve(event.detail);
    }

    function removeListeners() {
      // @ts-ignore
      document.removeEventListener('ecl_report_addon_imgur_upload_result', sucListener);
      // @ts-ignore
      document.removeEventListener('ecl_report_addon_imgur_upload_result_error', errListener);
    }
    // @ts-ignore
    document.addEventListener('ecl_report_addon_imgur_upload_result', sucListener);
    // @ts-ignore
    document.addEventListener('ecl_report_addon_imgur_upload_result_error', errListener);

    document.dispatchEvent(new CustomEvent('ecl_report_addon_imgur_upload', {detail: baseArray}));

  });
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((res) => {
    const reader = new FileReader();
    reader.onload = (readerEvt) => {
      // @ts-ignore
      const binaryString = readerEvt.target.result as string;
      const base64 = btoa(binaryString);
      return res(base64);
    };
    reader.readAsBinaryString(file);
  });
}
