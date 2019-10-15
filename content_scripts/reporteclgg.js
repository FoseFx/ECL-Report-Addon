const secret = '6Lcm82UUAAAAAJ5lLek01opD2mw59XfcFzfvs0hP'; // This is the ID used for reCaptcha. I found it in report.ecl.gg's source code

const html = `
console.log('injected');
console.log('is iframe', window.top !== window.self);
if (window.top !== window.self) {
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
          .then((resp) => resolve(resp))
          .catch((err) => reject(err));
      };
      document.addEventListener('ecl_report_addon_verification', fn);
    });
  }
});

function sendRequest(pl) {
  console.log('as str', JSON.stringify(pl));
  const URL = "https://report.ecl.gg/api/contact";
  const opts = {
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      "Accept": "application/json, text/plain, */*"
    },
    method: "POST",
    body: JSON.stringify(pl)
  };
  if (typeof content !== 'undefined') { // content.fetch is used by firefox 58 onwards to make request on behalf of the page
    return content.fetch(URL, opts);
  }
  return fetch(URL, opts); // chome does this by default
}
