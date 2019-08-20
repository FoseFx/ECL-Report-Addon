import {FaceItClass, ECL_ORGA_ID} from './faceit';
describe('init', () => {
    beforeEach(() => {
        // @ts-ignore
        window.ecl_reporter_init = false;
    });

    it('should only start once', () => {
        const obj = new FaceItClass();
        const spy = spyOn(obj, 'initDetectElements');
        obj.init();
        spy.calls.reset();
        // 2nd init
        obj.init();
        expect(spy).not.toHaveBeenCalled();
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

describe('detectElements', () => {
    it('should detectElements', () => {
        const obj = new FaceItClass();
        const spy = spyOn(obj, 'isECLRoom').and.returnValue(false);
        let res = obj.detectElements();
        expect(res).toEqual(false);
        expect(spy).not.toHaveBeenCalled();

        for (let i = 0; i < 10; i++) {
            const el = document.createElement('match-team-member-v2');
            el.setAttribute('eid', '' + i);
            document.body.appendChild(el);
        }
        res = obj.detectElements();
        expect(res).toEqual(true);
        expect(spy).toHaveBeenCalled();
    });
    it('should call morphing functions when in ECLRoom', () => {
        const obj = new FaceItClass();
        const spy = spyOn(obj, 'isECLRoom').and.returnValue(true);
        const spy2 = spyOn(obj, 'addReportButtons');
        const spy3 = spyOn(obj, 'buildPlayersArray');
        for (let i = 0; i < 10; i++) {
            const el = document.createElement('match-team-member-v2');
            el.setAttribute('eid', '' + i);
            document.body.appendChild(el);
        }
        const res = obj.detectElements();
        expect(res).toEqual(true);
        expect(spy).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
        expect(spy3).toHaveBeenCalled();
    });
});

it('should add button to players', () => {
    const obj = new FaceItClass();
    document.body.innerHTML = '';
    for (let i = 0; i < 10; i++) {
        const el = document.createElement('match-team-member-v2');
        el.setAttribute('eid', '' + i);
        const child = document.createElement('div');
        child.className = 'match-team-member__controls';
        el.appendChild(child);
        document.body.appendChild(el);
    }
    obj.addReportButtons(document.querySelectorAll('match-team-member-v2'));
});

it('isECLRoom', () => {
    const obj = new FaceItClass();
    const spy = spyOn(obj, 'getDataAboutElementFromAngular').and.returnValue({
        currentMatch: {match: {organizerId: 'sthelse'}}
    });
    // @ts-ignore
    const fakeNodes: NodeListOf<Element> = [{}];
    expect(obj.isECLRoom(fakeNodes)).toBe(false);

    spy.and.returnValue({
        currentMatch: {match: {organizerId: ECL_ORGA_ID}}
    });

    expect(obj.isECLRoom(fakeNodes)).toBe(true);

    // @ts-ignore
    expect(obj.isECLRoom([])).toBe(false);
});

// this test is only for coverage lmao
it('getDataAboutElementFromAngular', () => {
    // @ts-ignore
    window.angular = {element: (_) => ({inheritedData: () => ({$matchTeamMemberV2Controller: {}})})};

    const obj = new FaceItClass();
    // @ts-ignore
    expect(obj.getDataAboutElementFromAngular({})).toEqual({});

    // @ts-ignore
    delete window.angular;
});

it('should buildPlayersArray', () => {
    const obj = new FaceItClass();
    const spy = spyOn(obj, 'getDataAboutElementFromAngular').and.callFake(o => o);

    const fakeNodes: NodeListOf<Element> = [
        {teamMember: {id: 'id1', nickname: 'nn1'}, currentUserGuid: 'id1'},
        {teamMember: {id: 'id2', nickname: 'nn2'}, currentUserGuid: 'id1'},
        {teamMember: {id: 'id3', nickname: 'nn3'}, currentUserGuid: 'id1'}
    ] as unknown as NodeListOf<Element>;

    const expArr = [
        {name: 'nn1', guid: 'id1', isUser: true},
        {name: 'nn2', guid: 'id2', isUser: false},
        {name: 'nn3', guid: 'id3', isUser: false}
    ];
    obj.players = null;
    obj.buildPlayersArray(fakeNodes);

    expect(obj.players).toEqual(expArr);

});

