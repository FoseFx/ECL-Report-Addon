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
    document.addEventListener('ecl_report_addon_route_change', (e:CustomEvent) => {
        expect(e.detail).toBe('http://localhost/lol?lmao=false&true');
        next();
    });
    window.history.pushState({}, 'whocares?', 'http://localhost/lol?lmao=false&true');
});
