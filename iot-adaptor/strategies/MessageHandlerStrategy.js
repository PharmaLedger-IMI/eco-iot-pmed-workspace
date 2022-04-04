const commonServices = require("common-services")
const {EvidenceService, CommunicationService, DeviceServices} = commonServices;

module.exports = async function (err, message) {

    const communicationService = CommunicationService.getCommunicationServiceInstance();

    if (err) {
        return console.error(err);
    }
    message = JSON.parse(message);

    const evidenceService = new EvidenceService();
    const deviceService = new DeviceServices();

    switch (message.operation) {
        case "new_evidence":
            // console.log(message);
            evidenceService.mount(message.ssi, (err, mountedEntity) => {
                if (err){
                    console.log(err);
                }
                const entityId = mountedEntity.uid;
                console.log("**************** Data from Researcher SSAPP  ******************");
                console.log(mountedEntity);
                const domainConfig = {
                    "type": "IotAdaptor",
                    "option": {
                        "endpoint": "http://localhost:3000/iotAdapter"
                    }
                }
                let flow = $$.flow.start(domainConfig.type);
                flow.init(domainConfig);
                const dbName = "clinicalDecisionSupport";
                var evidenceData = {
                    "resourceType": "Evidence",
                    "url": "https://pharmaledger.eu/",
                    "identifier": [ {
                      "use": "temp",
                      "system": "http://example.com/Identifier-0",
                      "value": mountedEntity.uid
                    } ],
                    "title": mountedEntity.title,
                    "subtitle": mountedEntity.subtitle,
                    "description": mountedEntity.description,
                    "version": mountedEntity.version,
                    "status": mountedEntity.status,
                    "exposureBackground": {

                    },
                    "useContext": [ {
                      "code": {
                        "system": "http://example.com/Coding-0",
                        "code": "Coding-261"
                      }
                    } ],
                    "topic": [ {
                      "coding": [ {
                        "system": "http://example.com/CodeableConcept-0",
                        "code": "CodeableConcept-186"
                      } ]
                    } ]
                  };
                flow.createResource("Evidence", evidenceData,(error, result)=>{
                    if (error) {
                        console.log(error);
                    }
                    else console.log(result);
                });
            });
            break;

            case "list_evidences":
                const domainConfig = {
                    "type": "IotAdaptor",
                    "option": {
                        "endpoint": "http://localhost:3000/iotAdapter"
                    }
                }
                let flow = $$.flow.start(domainConfig.type);
                flow.init(domainConfig);
                flow.searchResources("Evidence","Evidence", (error, result)=>{
                    if (error) {
                        console.log(error);
                    }
                    else console.log(result);
                });
            break;

            case "add_device":
            deviceService.mountDevice(message.sReadSSI, (err, mountedDevice) => {
                if (err){
                    console.log(err);
                }
                const entityId = mountedDevice.sReadSSI;
                console.log(mountedDevice);
                const domainConfig = {
                    "type": "IotAdaptor",
                    "option": {
                        "endpoint": "http://127.0.0.1:3000/adaptor"
                    }
                };
                let flow = $$.flow.start(domainConfig.type);
                flow.init(domainConfig);
                const dbName = "clinicalDecisionSupport";
                flow.createResource(entityId, dbName, "Device", mountedDevice , (error, result) => {
                    if (error) {
                        console.log(error.status, error);
                    } else {
                        console.log(200, result);
                    }
                });
                // Push it to the hospital database or the iot Adaptor wallet

            });
            break;

            case "update_device":
            console.log(message);
            deviceService.mountDevice(message.sReadSSI, (err, mountedDevice) => {
                if (err){
                    console.log(err);
                }
                const entityId = mountedDevice.sReadSSI;
                console.log(mountedDevice);
                const domainConfig = {
                    "type": "IotAdaptor",
                    "option": {
                        "endpoint": "http://127.0.0.1:3000/adaptor"
                    }
                };

                let flow = $$.flow.start(domainConfig.type);
                flow.init(domainConfig);
                const dbName = "clinicalDecisionSupport";
                flow.createDsuResource(entityId, dbName, "Device", mountedDevice , (error, result) => {
                    if (error) {
                        console.log(error.status, error);
                    } else {
                        console.log(200, result);
                    }
                });
                // Push it to the hospital database or the iot Adaptor wallet

            });
            break;
        default:
            console.log("*******************************");
            console.log(`Received message from ${message.senderIdentity}`);
            console.log("*******************************");
            await communicationService.sendMessage(message.senderIdentity, message);
    }


}