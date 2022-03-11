const {WebcController} = WebCardinal.controllers;

export default class AlertController extends WebcController  {
    constructor(...props) {
        super(...props);
        this.dismissAlert();
    }

    dismissAlert() {
        this.onTagClick('close', () => {
            this.model.message.type = '';
        })
    }
}