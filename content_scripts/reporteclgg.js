const secret = '6Lcm82UUAAAAAJ5lLek01opD2mw59XfcFzfvs0hP';

const html = `
console.log('injected');
console.log('is iframe', window.top !== window.self);
if (true) {// (window.top !== window.self) {
  let h = \`
  <html>
  <head>
    <title>reCAPTCHA demo: Simple page</title>

    <script type="application/javascript">
    var onloadCallback = function() {
      const verifyCallback = (code) => {
        console.log(code);
        const ev = new CustomEvent('ecl_report_addon_verification', {detail: code});
        document.dispatchEvent(ev);
      };
      widgetId1 = grecaptcha.render('example1', {
        'sitekey' : '${secret}',
        'theme' : 'dark',
        'callback' : verifyCallback,
      });
    };
  </script>


  </head>
  <body>

  <div id="example1"></div>
  <script src="https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit" async defer></script>


  </body>
</html>
  \`;

  document.open();
  document.write(h);
  document.close();

}
`;

const el = document.createElement("script");
el.src = 'data:text/plain;base64,' + btoa(html);
document.head.appendChild(el);



browser.runtime.onMessage.addListener((req) => {
  if (req.type === 'REQUEST_REQUEST') {
      return new Promise((resolve, reject) => {
        const fn = (e) => {          
          document.removeEventListener('ecl_report_addon_verification', fn);
          const pl = req.data;
          pl.recaptcha = e.detail;
          sendRequest(pl)
            .then((resp) => resp.json())
            .then(resp => resolve(resp))
            .catch(err => reject(err));
        };
        document.addEventListener('ecl_report_addon_verification', fn);
      });
  }
});

function sendRequest(pl) {
  // todo fetch
  return Promise.reject('Was sucessfull :P');
}