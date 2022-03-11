const {WebcController} = WebCardinal.controllers;

export default class AlertController extends WebcController {
    constructor(...props) {
        super(...props);

        const element = props[0];
        this.onTagClick('close', () => {
            const template = element.parentElement;
            if(template) {
                template.remove();
            } else {
                element.remove();
            }
        });
    }
}