const {WebcController} = WebCardinal.controllers;
const commonServices = require("common-services");
const {momentService} = commonServices;

export default class ProgressModalController extends WebcController {

    constructor(...props) {
        super(...props);
    }

    onReady() {
        let progressElement = this.querySelector("#sendingFeedbacksProgress");
        let startTime = Date.now();
        let averageProgressRate;

        let changeProgressHandler = () => {
            let progress = this.model.feedbacksSending.progress;
            progressElement.style.width = progress + "%";
            averageProgressRate = (Date.now() - startTime) / progress;
            let leftTime = (100 - progress) * averageProgressRate;
            this.model.feedbacksSending.eta = momentService.utc(leftTime).format("HH:mm:ss")

            if (progress === 100) {
                this.model.feedbacksSending.sendingInProgress = false;
                this.model.offChange("feedbacksSending.progress", changeProgressHandler)
            }
        }

        this.model.onChange("feedbacksSending.progress", changeProgressHandler)
    }

}