import {ecl_route_inject} from './faceit_event_binding';

it('should emit event, when onpopstate is called', (next) => {
  ecl_route_inject();
  document.addEventListener('ecl_report_addon_route_change', (e) => {
    expect(true).toBe(true);
    next();
  });
  window.onpopstate(new PopStateEvent('pop'));
});
it('should emit event, when JS pushes new State to history', (next) => {
  ecl_route_inject();
  document.addEventListener('ecl_report_addon_route_change', (e: CustomEvent) => {
    expect(e.detail).toBe('http://localhost/lol?lmao=false&true');
    next();
  });
  window.history.pushState({}, 'whocares?', 'http://localhost/lol?lmao=false&true');
});
it('should emit event, when resized from below 1100px to above 1100px', (next) => {
  ecl_route_inject();
  // default is 1024px

  document.addEventListener('ecl_report_addon_route_change', () => {
    expect(true).toEqual(true);
    next();
  });
  // @ts-ignore
  global.innerWidth = 1500;
  // @ts-ignore
  global.dispatchEvent(new Event('resize'));

});

it('should emit event, when resized from above 1100px to below 1100px', (next) => {
  ecl_route_inject();
  // @ts-ignore
  global.innerWidth = 1500;
  // @ts-ignore
  global.dispatchEvent(new Event('resize'));

  document.addEventListener('ecl_report_addon_route_change', () => {
    expect(true).toEqual(true);
    next();
  });
  // @ts-ignore
  global.innerWidth = 1000;
  // @ts-ignore
  global.dispatchEvent(new Event('resize'));

});
