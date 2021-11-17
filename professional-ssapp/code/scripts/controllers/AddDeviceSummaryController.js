const {WebcController} = WebCardinal.controllers;
import DeviceService from "../services/DeviceService.js";

export default class AddDeviceSummaryController extends WebcController {
    constructor(element, history) {
        super(element, history);

        this.model = this.getState();

        this.attachHandlerEditButton();
        this.attachHandlerAcceptButton();
    }

    attachHandlerEditButton() {
        this.onTagClick('summary:edit', () => {
            console.log("Edit button pressed");
            this.navigateToPageTag('add-device', this.model.toObject());
        });
    }

    attachHandlerAcceptButton() {
        this.onTagClick('summary:accept', () => {
            this.DeviceService = new DeviceService();
            this.DeviceService.createDevice(this.model.toObject(), (err) => {
                if (err) {
                    console.error(err);
                }

                this.navigateToPageTag('confirmation-page', {
                    confirmationMessage: "Device included!",
                    redirectPage: "manage-devices"
                });
            });
        });
    }
}