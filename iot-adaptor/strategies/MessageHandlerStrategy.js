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
            console.log(message);
            evidenceService.mount(message.ssi, (err, mountedEntity) => {
                if (err){
                    console.log(err);
                }
                const entityId = mountedEntity.uid;
                evidenceService.getEvidences((err, evidences) => {
                    console.log("Total evidences:", evidences.length);

                    evidenceService.getEvidence(entityId, (err, evidence) => {
                        evidence.title = "The updated title from IOT Adaptor";
                        evidenceService.updateEvidence(evidence, () => {
                            console.log("Evidence updated");
                        });
                    })
                })
            });
            break;
        case "add_device":
            console.log(message);
            deviceService.mountDevice(message.sReadSSI, (err, mountedDevice) => {
                if (err){
                    console.log(err);
                }
                const entityId = mountedDevice.sReadSSI;
                console.log(mountedDevice)

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