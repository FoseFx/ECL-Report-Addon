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
    it('should call morphing functions when in ECLRoom and logged in', () => {
        const obj = new FaceItClass();
        spyOn(obj, 'getEmail').and.returnValue('some@test.com');
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
    obj.players = [];
    document.body.innerHTML = '';
    for (let i = 0; i < 10; i++) {
        const el = document.createElement('match-team-member-v2');
        el.setAttribute('eid', '' + i);
        const child = document.createElement('div');
        child.className = 'match-team-member__controls';
        el.appendChild(child);
        document.body.appendChild(el);
        obj.players.push({guid: i + '', isUser: i === 5, name: 'name', avatarUrl: 'some' });
    }
    obj.addReportButtons(document.querySelectorAll('match-team-member-v2'));

    for (let i = 0; i < 10; i++) {
        let el = document.querySelector(`match-team-member-v2[eid="${i}"]`);
        el = el.firstChild as Element;
        if (i !== 5) {
            expect(el.childElementCount).toEqual(1);
            expect((el.firstChild as HTMLAnchorElement).href).toEqual(`javascript:ecl_report_addon_report_click_handler(${i})`);
        } else {
            expect(el.childElementCount).toEqual(0);
        }
    }
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
        currentMatch: {match: {organizerId: ECL_ORGA_ID, entity: {name: 'some name'}}}
    });

    expect(obj.isECLRoom(fakeNodes)).toBe(true);
    expect(obj.roomName).toEqual('some name');
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
    spyOn(obj, 'getDataAboutElementFromAngular').and.callFake(o => o);

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

it('should show Popup', () => {
    const obj = new FaceItClass();
    obj.players = [
        {isUser: true, guid: 'user1', name: 'nick1', avatarUrl: 'test'},
        {isUser: false, guid: 'user2', name: 'nick2', avatarUrl: 'test'}
    ];
    obj.roomName = 'ECL Division 1 (27000 ELO MAX';
    spyOn(obj, 'getEmail').and.returnValue('somemail@test.com');
    const o = {show: false};
    spyOn(obj, 'getVueAppInstance').and.returnValue(o);
    obj.showReportPopup(1);
    expect(o).toEqual({
        show: true,
        division: '1',
        reportedName: 'nick2',
        reportedUUID: 'user2',
        complainantName: 'nick1',
        complainantUUID: 'user1',
        email: 'somemail@test.com',
        avatarUrl: 'test'
    });
});

it('should getVueAppInstance', () => {
    // @ts-ignore
    window.ecl_addon_vue_instance = {$children: ['some string']};
    const obj = new FaceItClass();
    expect(obj.getVueAppInstance()).toEqual('some string');

    // @ts-ignore
    delete window.ecl_addon_vue_instance;
});

it('should get division', () => {
    const obj = new FaceItClass();
    obj.roomName = 'ECL Division 3';
    expect(obj.getDivision()).toEqual('3');
    obj.roomName = 'ECL Division 333';
    expect(obj.getDivision()).toEqual('333');
    obj.roomName = 'ECL Division 1 (2700 ELO MAX)';
    expect(obj.getDivision()).toEqual('1');
    obj.roomName = 'ECL - AIM LADDER';
    expect(obj.getDivision()).toEqual('aim');
    obj.roomName = 'LEGENDS - 2700 ELO to enter';
    expect(obj.getDivision()).toEqual('legends');
    obj.roomName = 'lmao saoidjiuashduih asd jasik d67890';
    expect(obj.getDivision()).toEqual('');
});

it('should get email', () => {
    const obj = new FaceItClass();
    document.body.innerHTML = ``;
    expect(obj.getEmail()).toEqual(null);

    document.body.innerHTML = `<profile></profile>`;
    // @ts-ignore
    window.angular = {element: () => ({inheritedData: () => ({$profileController: {userStore: {currentUser: {email: 'test@test.com'}}}})})};
    expect(obj.getEmail()).toEqual('test@test.com');

    // @ts-ignore
    delete window.angular;

    expect(obj.getEmail()).toEqual(null);

});

