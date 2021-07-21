import InformationRequestService from "../services/InformationRequestService.js";
import DPermissionService from "../services/DPermissionService.js";
import AvailableStudiesToParticipateService from "../services/AvailableStudiesToParticipateService.js";
import EconsentStatusService from "../services/EconsentStatusService.js"


export default class DataMatchMakingService {

    constructor(DSUStorage) {

        this.DSUStorage = DSUStorage;

        this.list_permissions = []
        this.list_econsents = []
        this.list_irequests = []
    }

    listInformationRequests(){
        let dsu = this.DSUStorage;
        this.InformationRequestService = new InformationRequestService(dsu);
        this.InformationRequestService.getInformationRequests((err, data) => {
            if (err) {
                return console.log(err);
            }
            console.log("All information Requests are: " + (data.length));
            //console.log(JSON.stringify(all_information_requests[all_information_requests.length-1], null, 4 ));
            this.list_irequests.push(data);
        });
    }

    mountRequest(ssi){
        let dsu = this.DSUStorage;
        this.InformationRequestService = new InformationRequestService(dsu);
            this.InformationRequestService.mount(ssi, (err, data) => {
                if (err) {
                    return console.log(err);
                }
                console.log(JSON.stringify(data, null, 4 ));
            });
    }

    listDPermissions(){
        let dsu = this.DSUStorage;
        this.DPermissionService = new DPermissionService(dsu);
        this.DPermissionService.getDPermissions((err, data) => {
            if (err) {
                return console.log(err);
            }
            //console.log(JSON.stringify(data, null, 4));
            console.log("Total D Permissions are: " + (data.length));
            this.list_permissions.push(data);
        });
    }

    mountDPermission(ssi){
        let dsu = this.DSUStorage;
        this.DPermissionService = new DPermissionService(dsu);
        this.DPermissionService.mount(ssi, (err, data) => {
            if (err) {
                return console.log(err);
            }
            // console.log("This D Permission is: ");
            console.log(JSON.stringify(data, null, 4));
        });
    }

    generateParticipatingStudy(){
        let dsu = this.DSUStorage;
        this.AvailableStudiesToParticipateService = new AvailableStudiesToParticipateService(dsu);

        let sampleStudy = {
            study: "Study with date time: " + new Date().toString()
        }
        this.AvailableStudiesToParticipateService.saveStudy(sampleStudy, (err, data) => {
            if (err) {
                return console.log(err);
            }
            console.log("Sample Study saved with keySSI " + data.keySSI);
            return data.KeySSI;
        });
    }

    mountEConsent(ssi){
        let dsu = this.DSUStorage;
        this.EconsentStatusService = new EconsentStatusService(dsu);
        this.EconsentStatusService.mount(ssi,  (err, data) => {
            if (err) {
                return console.log(err);
            }
            // console.log("This E Consent is: ");
            console.log(JSON.stringify(data, null, 4));
        });
    }


    listEConsents(){
        let dsu = this.DSUStorage;
        this.EconsentStatusService = new EconsentStatusService(dsu);
        this.EconsentStatusService.getConsents((err, data) => {
            if (err) {
                return console.log(err);
            }
            console.log("Total consents are: " + (data.length));
            this.list_econsents.push(data);
        });
    }


}