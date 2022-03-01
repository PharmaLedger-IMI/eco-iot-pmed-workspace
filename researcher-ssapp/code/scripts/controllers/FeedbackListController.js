const {WebcController} = WebCardinal.controllers;
// const commonServices = require("common-services");
// const DidService =commonServices.DidService;
// import StudiesService from "../services/StudiesService.js";
// import DPermissionService from "../services/DPermissionService.js";
// const { DataSource } = WebCardinal.dataSources;


export default class FeedbackListController extends WebcController {
    constructor(...props) {
        super(...props);
        const prevState = this.getState() || {};
        this.model = prevState
        
        console.log(this.model)
    }
}