import DPermissionService from "../services/DPermissionService.js";
import EconsentStatusService from "../services/EconsentStatusService.js";
import {consentModelHL7} from "../models/HL7/ConsentModel.js";


export default class DConsentHelperService {

    constructor(DSUStorage) {
        this.DSUStorage = DSUStorage;
    }

    DPermissionCheckAndGeneration(){

        let dsu = this.DSUStorage;

        var dpermission_found = false;
        var  econsent_found = false;

        this.DPermissionService = new DPermissionService(dsu);
        this.EconsentStatusService = new EconsentStatusService(dsu);

        this.DPermissionService.getDPermissions((err, data) => {
            if (err) {
                return console.log(err);
            }
            //console.log(JSON.stringify(data, null, 4));
            console.log("Total D Permissions are: " + (data.length));
            for (let key in data){
                if(data[key].ConsentStatus.value === "active"){
                    console.log("DPermission is ACTIVE, check other filters");
                    let not_revoked = true;
                    if (not_revoked) {
                        let DPermissionObject = data[key];
                        console.log("D Permission found and ......")
                        // Send DSU or Do something else
                        dpermission_found = true;
                        break;
                    }
                    else{
                        console.log("D Permission cannot be generated, it has been revoked, rejected!");
                    }
                }
            }
            if (dpermission_found === false){
                this.EconsentStatusService.getConsents((err, data) => {
                    if (err) {
                        return console.log(err);
                    }
                    console.log("Total consents are: " + (data.length));
                    for (let key in data) {
                        if(data[key].ConsentStatus.value === "active"){
                            let DPermissionObject = data[key];
                            // Add metadata to the new D Permission object
                            DPermissionObject.ConsentStatus.value = "New Generated Automatically from EConsent";
                            DPermissionObject.Metadata = "metadata";
                            DPermissionObject.Revoked = "no";
                            // optional?? send to researcher ?? ACCEPT SEND DSU
                            this.DPermissionService.saveDPermission(DPermissionObject, (err, data) => {
                                if (err) {
                                    return console.log(err);
                                }
                                console.log("New Dynamic Automatic Permission Object saved with keySSI " + data.keySSI);
                                //console.log(JSON.stringify(data, null, 4));
                            });
                            econsent_found = true;
                            break;
                        }
                    }
                    if (econsent_found === false){
                        let answer = window.confirm("E Consent not found. Do you agree to donate/share this content?");
                        if (answer) {
                            console.log("USER DOES AGREE")

                            let DPermissionObject = JSON.parse(JSON.stringify(consentModelHL7));
                            // Add metadata to the new D Permission object
                            DPermissionObject.ConsentStatus.value = "active";
                            DPermissionObject.Metadata = "metadata";
                            DPermissionObject.Revoked = "no";
                            // optional?? send to researcher ?? ACCEPT SEND DSU
                            this.DPermissionService.saveDPermission(DPermissionObject, (err, data) => {
                                if (err) {
                                    return console.log(err);
                                }
                                console.log("New D Permission Generated Manually from UI with keySSI " + data.keySSI);
                            });
                        }
                        else {
                            console.log("USER DOES NOT AGREE")
                        }
                    }
                });
            }
        });
    }
}