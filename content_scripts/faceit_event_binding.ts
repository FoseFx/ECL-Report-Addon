export function ecl_route_inject() {
    // here we overwrite pushState(), so we can emit an event everytime
    // faceit'S angularjs router routes the user somewhere
    const pushState = window.history.pushState;
    window.history.pushState = function(_, __, url) {
        const ev = new CustomEvent('ecl_report_addon_route_change', {detail: url});
        document.dispatchEvent(ev);
        return pushState.apply(window.history, arguments);
    };
    // if the user uses the arrows or other ways (like alt + back-key) to instruct
    // the browser to route somewhere the "onpopstate" function is invoked
    // where we can emit an event aswell
    window.onpopstate = () => {
        const ev = new CustomEvent('ecl_report_addon_route_change', {detail: document.location.href});
        document.dispatchEvent(ev);
    };
}
ecl_route_inject();
