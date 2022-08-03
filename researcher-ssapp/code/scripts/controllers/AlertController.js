const {WebcController} = WebCardinal.controllers;

export default class AlertController extends WebcController {
    constructor(...props) {
        super(...props);

        this.onTagClick('close', () => {
            this.model.message.type = "hidden";
        });
    }
}