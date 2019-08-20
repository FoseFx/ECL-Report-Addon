'use strict';

export const ECL_ORGA_ID = 'edc12227-3b07-4c5e-9325-f223025628f3';

interface Player {
    name: string;
    guid: string;
    isUser: boolean;
}

interface AngualarPlayerElementInfo {
    currentUserGuid: string;
    teamMember: {
        id: string;
        nickname: string
    };
    currentMatch: {
        match: {
            organizerId: string
        }
    };
}


export class FaceItClass {


    currentInterval = -1;
    players: Player[] = null;

    init() {
        // @ts-ignore
        if (window.ecl_reporter_init) { // only execute once per tab
            return;
        }
        // @ts-ignore
        window.ecl_reporter_init = true;


        document.addEventListener('ecl_report_addon_route_change', (e: CustomEvent) => {
            this.initDetectElements(e.detail);
        });
        this.initDetectElements(location.href);
    }

    initDetectElements(route: string) {
        console.log('initdetectelements');
        console.log('isroom', this.isRoomRoute(route));

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
            this.players = null;
        }
    }

    detectElements(): boolean {
        const nodes = document.querySelectorAll('match-team-member-v2');
        console.log(nodes);

        if (nodes.length === 0) {
            return false;
        }
        if (this.isECLRoom(nodes)) {
            this.addReportButtons(nodes);
            this.buildPlayersArray(nodes);
        }
        return true;
    }

    isRoomRoute(route: string): boolean {
        const regex = /^https:\/\/(www.)faceit.com\/[a-z]{2}\/csgo\/room\/[0-9a-z\-]+\/?$/;
        const matches = regex.test(route);
        return matches;
    }

    isECLRoom(nodes: NodeListOf<Element>): boolean {
        const firstElement = nodes[0];
        if (!firstElement) { // something went wrong
            return false;
        }
        const data = this.getDataAboutElementFromAngular(firstElement);
        console.log('data', data);

        return data.currentMatch.match.organizerId === ECL_ORGA_ID;
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

    // this function builds an array on Players for the current room
    buildPlayersArray(nodes: NodeListOf<Element>) {
        // @ts-ignore
        const arr: Element[] = Array.from(nodes);

        const players: Player[] = [];

        for (const el of arr) {
            const data = this.getDataAboutElementFromAngular(el);
            const player: Player = {
                guid: data.teamMember.id,
                name: data.teamMember.nickname,
                isUser: data.currentUserGuid === data.teamMember.id
            };
            players.push(player);
        }
        this.players = players;
        console.log(players);

    }

    // for debugging purposes angularJS (the framework faceit is written in) ships with
    // a method witch returns the data from a given angular element
    // we use it to extract guid and nickname for each player
    getDataAboutElementFromAngular(el: Element): AngualarPlayerElementInfo {
        // @ts-ignore
        return angular.element(el).inheritedData().$matchTeamMemberV2Controller;
    }

}

const i = new FaceItClass();
i.init();
