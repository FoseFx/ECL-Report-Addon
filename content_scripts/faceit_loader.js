const el = document.createElement('script');
el.type = 'module';
el.src = browser.extension.getURL('content_scripts/faceit.js');
document.head.appendChild(el);

const el2 = document.createElement('script');
el2.type = 'module';
el2.src = browser.extension.getURL('content_scripts/faceit_event_binding.js');
document.head.appendChild(el2);
