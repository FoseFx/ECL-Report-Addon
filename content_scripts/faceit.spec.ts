import {FaceItClass} from './faceit';
describe('init', () => {
    beforeEach(() => {
        // @ts-ignore
        window.ecl_reporter_init = false;
    });

    it('should only start once', () => {
        const obj = new FaceItClass();
        const spy = spyOn(obj, 'injectOnRouteChangeScript');
        obj.init();
        spy.calls.reset();
        // 2nd init
        obj.init();
        expect(spy).not.toHaveBeenCalled();
    });

    it('should register an event listener for ecl_report_addon_route_change events', () => {
        const obj = new FaceItClass();
        const spy = spyOn(obj, 'initDetectElements');
        spyOn(obj, 'injectOnRouteChangeScript'); // dont inject anything for this
        obj.init();
        document.dispatchEvent(new CustomEvent('ecl_report_addon_route_change', {detail: 'http://localhost/test'}));
        expect(spy).toHaveBeenCalledTimes(2); // first time is when initialised
    });

});
describe('initDetectElements', () => {

    it('should stop ongoing inervals', () => {
        const obj = new FaceItClass();
        obj.currentInterval = 5;
        spyOn(obj, 'isRoomRoute').and.returnValue(false);
        obj.initDetectElements('');
        expect(obj.currentInterval).toEqual(-1);
    });

    it('should set Interval until found', () => {
        jest.useFakeTimers();
        const obj = new FaceItClass();
        spyOn(obj, 'isRoomRoute').and.returnValue(true);
        const spy = spyOn(obj, 'detectElements').and.returnValue(false);
        obj.initDetectElements('');

        jest.runOnlyPendingTimers();
        expect(obj.currentInterval).not.toEqual(-1);

        spy.and.returnValue(true);

        jest.runAllTimers();

        expect(obj.currentInterval).toEqual(-1);
    });
});

it('should detectElements', () => {
    const obj = new FaceItClass();
    let res = obj.detectElements();
    expect(res).toEqual(false);
    for (let i = 0; i < 10; i++) {
        const el = document.createElement('match-team-member-v2');
        el.setAttribute('eid', '' + i);
        document.body.appendChild(el);
    }
    res = obj.detectElements();
    expect(res).toEqual(true);
});

it('should injectOnRouteChangeScript', () => {
    const obj = new FaceItClass();
    spyOn(obj, 'getBrowser').and.returnValue({extension: {getURL: () => 'http://host/'}});
    obj.injectOnRouteChangeScript();
    const el = document.head.children[document.head.childElementCount - 1] as HTMLScriptElement;
    expect(el).toBeTruthy();
    expect(el.type).toEqual('module');
    expect(el.src).toEqual('http://host/');
});

it('should getBrowser', () => {
    // @ts-ignore
    window.browser = 'some secret shit';
    const obj = new FaceItClass();
    expect(obj.getBrowser()).toEqual('some secret shit');
    // @ts-ignore
    delete window.browser;
});
