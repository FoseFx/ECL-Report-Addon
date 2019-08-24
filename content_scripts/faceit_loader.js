// injects main script
injectScript('faceit.js', true);

// injects route event script
injectScript('faceit_event_binding.js', true);

// injects vue form
const mountEl = document.createElement('div');
mountEl.id = 'ecl_popup_mount';
document.body.appendChild(mountEl);

injectCSS('https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900');
injectCSS('https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons.min.css');
injectCSS(browser.extension.getURL('content_scripts/app.css'));

injectScript('app.js');

function injectScript(name, isModule) {
    const el = document.createElement('script');
    el.src = browser.extension.getURL('content_scripts/' + name);
    if (isModule) {
        el.type = 'module';
    }
    document.head.appendChild(el);
}
function injectCSS(href) {
    const el = document.createElement('link');
    el.rel = 'stylesheet';
    el.href = href;
    document.head.appendChild(el);
}

document.addEventListener('ecl_report_addon_query_built', (e) => {
    const report = e.detail;
    console.log('loader: listener: report', report);
    const req = {
        type: 'BUILT_QUERY',
        data: report
    };
    browser.runtime.sendMessage(req).then((arg) => {
        console.log('loader: promise then:', arg);
        document.dispatchEvent(new CustomEvent('ecl_report_addon_fetch_success', {detail: arg}));
    }).catch((arg) => {
        console.log('loader: promise catch:', arg);
        document.dispatchEvent(new CustomEvent('ecl_report_addon_fetch_failed', {detail: arg}));
    });
});
