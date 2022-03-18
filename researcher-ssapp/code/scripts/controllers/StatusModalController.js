const { WebcController } = WebCardinal.controllers;

export default class StatusModalController extends WebcController {
    constructor(...props) {
        super(...props);

        this.model.onChange('statusModal.note.value', () => {
            this.model.statusModal.noteIsEmpty = this.model.statusModal.note.value.trim() === "";
        });
    }
}