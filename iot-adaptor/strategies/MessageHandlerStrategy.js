const commonServices = require("common-services")
const {EvidenceService, CommunicationService} = commonServices;

module.exports = async function (err, message) {

    const communicationService = CommunicationService.getCommunicationServiceInstance();

    if (err) {
        return console.error(err);
    }
    message = JSON.parse(message);

    const evidenceService = new EvidenceService();

    switch (message.operation) {
        case "new_evidence":
            evidenceService.mount(message.ssi, (err, mountedEntity) => {
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
        default:
            console.log("*******************************");
            console.log(`Received message from ${message.senderIdentity}`);
            console.log("*******************************");
            await communicationService.sendMessage(message.senderIdentity, message);
    }


}