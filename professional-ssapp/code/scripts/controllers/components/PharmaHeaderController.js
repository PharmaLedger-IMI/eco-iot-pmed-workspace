const {WebcController} = WebCardinal.controllers;

export default class PharmaHeaderController extends WebcController {
    constructor(element, history) {
        super(element, history);

        this.model = {};

        this.initHelpHandler();
        this.initLogoutHandler();
    }

    initHelpHandler() {
        this.onTagClick("header:help", () => {
            console.log("[HEADER] help pressed!");
        });
    }

    initLogoutHandler() {
        this.onTagClick("header:logout", () => {
            console.log("[HEADER] logout pressed!");
        });
    }
}