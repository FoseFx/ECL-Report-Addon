'use strict';
export class FaceItClass {


    currentInterval = -1;

    init() {
        // @ts-ignore
        if (window.ecl_reporter_init) { // only execute once per tab
            return;
        }
        // @ts-ignore
        window.ecl_reporter_init = true;

        this.injectOnRouteChangeScript();

        document.addEventListener('ecl_report_addon_route_change', (e: CustomEvent) => {
            this.initDetectElements(e.detail);
        });
        this.initDetectElements(location.href);
    }

    initDetectElements(route: string) {
        console.log('initdetectelements');

        if (this.isRoomRoute(route)) { // user routed to /room/
            const interval = setInterval(() => { // wait for everything to load
                this.currentInterval = interval;
                if (this.detectElements()) { // when elements found, clear interval
                    clearInterval(this.currentInterval);
                    this.currentInterval = -1;
                }
            }, 3000);
        } else { // user was on /room/ but left before it loaded
            clearInterval(this.currentInterval);
            this.currentInterval = -1;
        }
    }

    detectElements(): boolean {
        const nodes = document.querySelectorAll('match-team-member-v2');
        console.log(nodes);
        return nodes.length !== 0;
    }

    isRoomRoute(route: string): boolean {
        const regex = /^https:\/\/(www.)faceit.com\/[a-z]{2}\/csgo\/room\/[0-9a-z\-]+\/?$/;
        const matches = regex.test(route);
        return matches;
    }

    injectOnRouteChangeScript() {
        const el = document.createElement('script');
        el.type = 'module';
        el.src = this.getBrowser().extension.getURL('content_scripts/faceit_event_binding.js');
        document.head.appendChild(el);
    }

    getBrowser(): any {
        // @ts-ignore
        return browser;
    }

}
// this will start the init() function in browsers,
// and wont do anything in a testing-env
// @ts-ignore
if (typeof browser !== 'undefined') {
    const i = new FaceItClass();
    i.init();
}
