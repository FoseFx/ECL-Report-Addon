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
            const interval = setInterval(() => {
                this.currentInterval = interval;
                if (this.detectElements()) { // when elements found, clear interval
                    clearInterval(this.currentInterval);
                    this.currentInterval = -1;
                }
            }, 3000) as unknown as number;
        } else { // user was on /room/ but left before it loaded
            clearInterval(this.currentInterval);
            this.currentInterval = -1;
        }
    }

    detectElements(): boolean {
        const nodes = document.querySelectorAll('match-team-member-v2');
        if (nodes.length === 0) {
            return false;
        }
        this.addReportButtons(nodes);
        return true;
    }

    isRoomRoute(route: string): boolean {
        const regex = /^https:\/\/(www.)faceit.com\/[a-z]{2}\/csgo\/room\/[0-9a-z\-]+\/?$/;
        const matches = regex.test(route);
        return matches;
    }

    // this function injects `faceit_event_binding.ts` into the faceit website
    // it will make sure the `ecl_report_addon_route_change` event will be dispatched
    injectOnRouteChangeScript() {
        const el = document.createElement('script');
        el.type = 'module';
        el.src = this.getBrowser().extension.getURL('content_scripts/faceit_event_binding.js');
        document.head.appendChild(el);
    }

    // own function needed b/c of tests
    getBrowser(): any {
        // @ts-ignore
        return browser;
    }

    // this will add the ECL-Report button to each player in the match
    addReportButtons(nodes: NodeListOf<Element>) {
        // @ts-ignore
        const arr = Array.from(nodes);

        for (const node of arr) {
            const parentOfButton = node.querySelector('.match-team-member__controls');
            const el = document.createElement('a');
            el.className = 'match-team-member__controls__button inline-block pull-left';
            el.innerHTML = 'ecl';
            parentOfButton.appendChild(el);
        }
    }

}
// this will start the init() function in browsers,
// and wont do anything in a testing-env
// @ts-ignore
if (typeof browser !== 'undefined') {
    const i = new FaceItClass();
    i.init();
}
