let currentWidth = window.innerWidth;


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
  // when the user resizes the window faceit will
  // rerender the team-member components when the threshold of
  // 1100px is crossed
  // whe fix this by re-emitting the event

  window.onresize = () => {
    if ((currentWidth > 1100 && window.innerWidth < 1100) || (currentWidth < 1100 && window.innerWidth > 1100)) {
      const ev = new CustomEvent('ecl_report_addon_route_change', {detail: document.location.href});
      document.dispatchEvent(ev);
    }
    currentWidth = window.innerWidth;
  };

}
ecl_route_inject();
