const { WebcController } = WebCardinal.controllers;
const commonServices = require("common-services");
const {EvidenceService, StudiesService} = commonServices;
const  {getCommunicationServiceInstance} = commonServices.CommunicationService;
const CONSTANTS = commonServices.Constants;
const BreadCrumbManager = commonServices.getBreadCrumbManager();

export default class AddEvidenceController extends BreadCrumbManager {
    constructor(...props) {

        super(...props);

        const prevState = this.getState() || {};

        this.model.breadcrumb = this.setBreadCrumb(
            {
                label: "New Evidence",
                tag: "evidence"
            }
        );

        this.model.studyID = prevState.uid;
        this.model = this.getEvidenceDetailsViewModel();
        this.CommunicationService = getCommunicationServiceInstance();
        this.model.participantsDIDs = [];
        this.StudiesService = new StudiesService();
        this.StudiesService.getStudy(this.model.studyID, (err, studyData) => {
            if (err){
                return console.log(err);
            }
            studyData.participants.forEach(participant=>{this.model.participantsDIDs.push(participant.participantInfo.patientDID);
            });
        });

        this._attachHandlerGoBack();
        this._attachHandlerAddEvidenceConfirm();
        this._attachHandlerFileOperation();

    }

    sendMessageToTps( subjectsDids, evidenceSReadSSI) {
        subjectsDids.forEach(did => {
            this.CommunicationService.sendMessage( did, {
                operation: CONSTANTS.MESSAGES.RESEARCHER.NEW_EVIDENCE,
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
        console.log(evidence);
        return evidence;
    }

    saveEvidence() {
        window.WebCardinal.loader.hidden = false;
        this.EvidenceService = new EvidenceService();
        this.EvidenceService.saveEvidence(this.prepareEvidenceDSUData(), (err, evidence) => {
            let evidenceState = {};
            console.log(evidence.sReadSSI);
            if (this.model.filesEvidence.file.file) {
                this.EvidenceService.addEvidenceFile(this.model.filesEvidence.file, evidence.uid);
            }
            if (err) {
                evidenceState = {
                    uid: this.model.studyID,
                    breadcrumb: this.model.toObject('breadcrumb'),
                    message: {
                        content: `An error has been occurred!`,
                        type: 'error'
                    }
                }
            } else {
                evidenceState = {
                    uid: this.model.studyID,
                    breadcrumb: this.model.toObject('breadcrumb'),
                    message: {
                        content: `The study ${this.model.title.value} evidence has been created!`,
                        type: 'success'
                    }
                }
            }
            this.sendMessageToTps(this.model.participantsDIDs, evidence.sReadSSI);
            window.WebCardinal.loader.hidden = true;
            this.navigateToPageTag('evidence-list', evidenceState);
        })

    }

    _attachHandlerGoBack() {
        this.onTagClick('go:back', () => {
            this.navigateToPageTag('evidence-list', { uid: this.model.studyID, breadcrumb: this.model.toObject('breadcrumb') });
        });
    }

    _attachHandlerFileOperation(){
        this.model.onChange('filesEvidence', () => {
            let filesArray = this.model.filesEvidence.files || [];
        });

        this.on('add-evidence-file', (event) => {
            let filesArray = event.data;
            if (filesArray && filesArray.length > 0) {
                this.model.filesEvidence.file.file = filesArray[0];
                this.model.filesEvidence.file.name = filesArray[0].name;
            } else {
                this.model.filesEvidence.file.file = null;
                this.model.filesEvidence.file.name = "";
            }
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
            },
            filesEvidence: {
                topLabel: "Select pdf files to upload the results",
                label: "",
                accept: ".pdf",
                listFiles: true,
                filesAppend: false,
                file: {},
                value: ""
            }
        }
    }

}