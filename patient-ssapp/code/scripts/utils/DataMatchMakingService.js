import InformationRequestService from "../services/InformationRequestService.js";
import DPermissionService from "../services/DPermissionService.js";
import AvailableStudiesToParticipateService from "../services/AvailableStudiesToParticipateService.js";
import EconsentStatusService from "../services/EconsentStatusService.js"


const IncomingRequest = {
    title: "Title of Request",
    status: "Status of the Request",
    terms: "Terms of the Request",
    issued: "Date Issuance of the Request",
    version: "Version of the Request",
    startDate: "Start Date of the Request",
    endDate: "EndDate of the Request"
}

export default class DataMatchMakingService {

    constructor(DSUStorage, request_ssi) {

        this.DSUStorage = DSUStorage;
        this.InformationRequestSSI = request_ssi;
        this.list_irequests = [];

        console.log("Data MatchMaking Function Started with Information Request keySSI: " + this.InformationRequestSSI);
        this.request = IncomingRequest;
        this.mountAndDataMatchMakingRequest(this.InformationRequestSSI);
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

    printTheRequest(){
        console.log(this.request);
    }

    mountAndDataMatchMakingRequest(ssi){
        let dsu = this.DSUStorage;
        this.InformationRequestService = new InformationRequestService(dsu);
            this.InformationRequestService.mount(ssi, (err, data) => {
                if (err) {
                    return console.log(err);
                }

                this.request.title = data.ContractTitle
                this.request.status = data.ContractStatus
                this.request.terms = data.ContractTerm
                this.request.issued = new Date(data.ContractIssued)
                this.request.version = data.ContractVersion
                this.request.startDate = new Date(data.ContractApplies[0])
                this.request.endDate   = new Date(data.ContractApplies[1])

                if (this.request.status === "executable"){
                    console.log("This request can be executed if there are available data for the requested dates.");
                    switch(this.request.terms) {
                        case "ecg":
                            console.log("Looking for ECG data...")
                            this.checkForPatientData("ecg");
                            break;
                        case "respiration":
                            console.log("Looking for respiration data...")
                            this.checkForPatientData("respiration");
                            break;
                        case "spo2":
                            console.log("Looking for SpO2 data...")
                            this.checkForPatientData("spo2");
                            break;
                        case "temperature":
                            console.log("Looking for temperature data...")
                            this.checkForPatientData("temperature");
                            break;
                        default:
                            console.log("default")
                    }
                }
                else{
                    console.log("This request cannot be executed or is cancelled or is already offered.");
                }
            });
    }

    checkForPatientData(data){
        if(data == "ecg"){
            let found_data = true; // check for real data here
            if (found_data){
                console.log("Data found. Checking the requested dates.")
                let sample_date_min = new Date(2020, 0, 1);
                let sample_date_max = new Date(2021, 11, 1);
                if((sample_date_min.getTime() < new Date().getTime()) && (new Date().getTime()<sample_date_max.getTime()))  {
                    console.log("Data found within the dates' range. Creating the Shareable DSU.")
                    this.generateParticipatingStudy();
                }
                else{
                    console.log("There are no available data for the requested dates.")
                }
            }
        }
    }


    generateParticipatingStudy(){
        let dsu = this.DSUStorage;
        this.AvailableStudiesToParticipateService = new AvailableStudiesToParticipateService(dsu);
        let study =  this.request;
        this.AvailableStudiesToParticipateService.saveStudy(study, (err, data) => {
            if (err) {
                return console.log(err);
            }
            console.log("Sample Study saved with keySSI " + data.keySSI);
        });
    }


}