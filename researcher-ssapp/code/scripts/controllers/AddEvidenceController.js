const { WebcController } = WebCardinal.controllers;
const commonServices = require("common-services");
const {EvidenceService} = commonServices;
const  {getCommunicationServiceInstance} = commonServices.CommunicationService;
const CONSTANTS = commonServices.Constants;

const COMMUNICATION_MESSAGES = {
    NEW_EVIDENCE:"new_evidence"
}


export default class AddEvidenceController extends WebcController {
    constructor(...props) {

        super(...props);

        const prevState = this.getState() || {};
        const { breadcrumb, ...state } = prevState;

        this.model.breadcrumb = breadcrumb;
        this.model.breadcrumb.push({
            label: 'New Evidence',
            tag: "evidence",
            state: state
        });

        this.model.studyID = state.uid;
        this.model = this.getEvidenceDetailsViewModel();

        this.CommunicationService = getCommunicationServiceInstance();

        this._attachHandlerGoBack();
        this._attachHandlerAddEvidenceConfirm();
        console.log(this.model.studyID)

    }

    sendMessageToTps( subjectsDids, evidenceSReadSSI) {
        subjectsDids.forEach(did => {
            this.CommunicationService.sendMessage( did, {
                operation: CONSTANTS.NOTIFICATIONS_TYPE.NEW_EVIDENCE,
                ssi: evidenceSReadSSI,
                shortDescription: 'Researcher sent evidence to patient',
            });
        })
    }

    prepareEvidenceDSUData() {
        let evidence = {
            title: this.model.title.value,
            subtitle: this.model.subtitle.value,
            version: this.model.version.value,
            status: this.model.status.value,
            topics: this.model.topics.value,
            exposureBackground: this.model.exposureBackground.value,
            description: this.model.description.value,
            studyID: this.model.studyID
        }
        console.log(evidence)
        return evidence;
    }

    saveEvidence() {
        window.WebCardinal.loader.hidden = false;
        this.EvidenceService = new EvidenceService();
        this.EvidenceService.saveEvidence(this.prepareEvidenceDSUData(), (err, evidence) => {
            let evidenceState = {};

            if (err) {
                evidenceState = {
                    uid: this.model.studyID,
                    breadcrumb: this.model.breadcrumb.toObject(),
                    message: {
                        content: `An error has been occurred!`,
                        type: 'error'
                    }
                }
            } else {
                evidenceState = {
                    uid: this.model.studyID,
                    breadcrumb: this.model.breadcrumb.toObject(),
                    message: {
                        content: `The study ${this.model.title.value} evidence has been created!`,
                        type: 'success'
                    }
                }
            }

            //send evidence DSU to iotAdaptor
            // const communicationService = getCommunicationServiceInstance();
            this.CommunicationService.sendMessageToIotAdapter({
                operation:COMMUNICATION_MESSAGES.NEW_EVIDENCE,
                ssi:evidence.keySSI
            })

            this.sendMessageToTps(this.model.subjects_did.value.split(',').map(e=> e.trim()), evidence.sReadSSI);

            window.WebCardinal.loader.hidden = true;
            this.navigateToPageTag('evidence-list', evidenceState);
        })
    }

    _attachHandlerGoBack() {
        this.onTagClick('go:back', () => {
            this.navigateToPageTag('evidence-list', { uid: this.model.studyID, breadcrumb: this.model.breadcrumb.toObject() });
        });
    }

    _attachHandlerAddEvidenceConfirm() {
        this.onTagClick('evidence-confirm', () => {
            this.saveEvidence();
            //this.navigateToPageTag('');
        });
    }

    getEvidenceDetailsViewModel() {
        return {
            title: {
                name: 'title',
                id: 'title',
                label: "Title",
                placeholder: 'Title of the Evidence',
                required: true,
                value: ""
            },
            subtitle: {
                name: 'subtitle',
                id: 'subtitle',
                label: "Subtitle",
                placeholder: 'Subtitle of the Evidence',
                value: ""
            },
            subjects_did: {
                value:'',
                placeholder: 'subject did',
                label: 'Subjects did'
            },
            version: {
                name: 'version',
                id: 'Version',
                label: "Version",
                placeholder: 'Version',
                value: ""
            },
            status: {
                label: "Status",
                required: true,
                options: [{
                    label: "Draft",
                    value: 'draft'
                },
                {
                    label: "Active",
                    value: 'active'
                },
                {
                    label: "Retired",
                    value: 'retired'
                },
                {
                    label: "Unknown",
                    value: 'unknown'
                }
                ],
                value: ""
            },
            topics: {
                label: "Topics",
                required: true,
                options: [{
                    label: "Topic 1",
                    value: 'Topic 1'
                },
                {
                    label: "Topic 2",
                    value: 'Topic 2'
                },
                {
                    label: "Topic 3",
                    value: 'Topic 3'
                },
                {
                    label: "Topic 4",
                    value: 'Topic 4'
                }
                ],
                value: ""
            },
            exposureBackground: {
                label: "Exposure Background",
                required: true,
                options: [{
                    label: "EP_1",
                    value: 'EP_1'
                },
                {
                    label: "EP_2",
                    value: 'EP_2'
                },
                {
                    label: "EP_3",
                    value: 'EP_3'
                },
                {
                    label: "EP_4",
                    value: 'EP_4'
                },
                ],
                value: ""
            },
            description: {
                name: 'description',
                label: "Description",
                placeholder: 'Provide description of the evidence',
                required: true,
                value: ""
            },
            id: {
                name: 'id of the evidence',
                label: "id",
                placeholder: 'id of the evidence',
                value: '001'
            }
        }
    }

}