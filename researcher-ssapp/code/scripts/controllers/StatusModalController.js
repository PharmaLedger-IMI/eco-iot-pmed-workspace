const { WebcController } = WebCardinal.controllers;

export default class StatusModalController extends WebcController {
    constructor(...props) {
        super(...props);

        this.model.onChange('statusModal.comment.value', () => {
            this.model.statusModal.commentIsEmpty = this.model.statusModal.comment.value.trim() === "";
        });
    }
}