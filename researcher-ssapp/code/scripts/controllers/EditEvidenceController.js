import EvidenceService from "../services/EvidenceService.js";
const {WebcController} = WebCardinal.controllers;


export default class EditEvidenceController extends WebcController {
    constructor(...props) {
        super(...props);

        const prevState = this.getState() || {};
        this.model.evidence_uid = prevState.evidenceID;
        this.model.study_id = prevState.studyID;
        this.model.breadcrumb = prevState.breadcrumb;
        this.model.header = "Edit Evidence";

        const {breadcrumb, ...state} = prevState

        this.model.breadcrumb.push({
            label:`${this.model.header}`,
            tag:"",
            state: state
        });

        this.EvidenceService = new EvidenceService();
        this.EvidenceService.getEvidence(this.model.evidence_uid, (err, evidence) => {
            if (err){
                return console.log(err);
            }
            this.model = this.getEvidenceDetailsViewModel(evidence);
        });

        this._attachHandlerBackMenu();
        this._attachHandlerEditEvidence();
    }

    _attachHandlerBackMenu() {
        this.onTagClick('go:back', (event) => {

            let evidenceState = {
                uid: this.model.study_id, 
                breadcrumb: this.model.breadcrumb.toObject()
            }
            this.navigateToPageTag('evidence-list', evidenceState);

        });
    }

    prepareEvidenceDSUData(){
        let evidence = {
            title: this.model.title.value,
            subtitle: this.model.subtitle.value,
            version: this.model.version.value,
            status: this.model.status.value,
            topics: this.model.topics.value,
            exposureBackground: this.model.exposureBackground.value,
            description: this.model.description.value,
            studyID: this.model.study_id,
            uid: this.model.evidence_uid
        }
        console.log(evidence)
        return evidence;
    }

    updateEvidence(){
        this.EvidenceService.updateEvidence(this.prepareEvidenceDSUData(), (err, data) => {
            let message = {};

            if (err) {
                message.content = "An error has been occurred!";
                message.type = 'error';
            } else {
                message.content = `The evidence ${this.model.title.value} has been updated!`;
                message.type = 'success'
            }
            this.navigateToPageTag('evidence-list', { 
                message: message,
                uid: this.model.study_id, 
                breadcrumb: this.model.breadcrumb.toObject() 
            });
        })
    }

    _attachHandlerEditEvidence() {
        this.onTagClick('edit:evidence', (event) => {
            this.updateEvidence();
        });
    }

    getEvidenceDetailsViewModel(evidence) {
        return {
            title: {
                name: 'title',
                id: 'title',
                label: "Title: ",
                placeholder: 'Title of the Evidence',
                required: true,
                value: evidence.title || ""
            },
            subtitle: {
                name: 'subtitle',
                id: 'subtitle',
                label: "Subtitle: ",
                placeholder: 'Subtitle of the Evidence',
                value: evidence.subtitle || ""
            },
            version: {
                name: 'version',
                id: 'Version',
                label: "Version",
                placeholder: 'Version',
                value: evidence.version || ""
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
                value: evidence.status || ""
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
                value: evidence.topics || ""
            },
            exposureBackground: {
                name: 'exposure background',
                id: 'Exposure Background',
                placeHolder: 'Exposure Background',
                label: 'Exposure Background',
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
                value: evidence.exposureBackground || ""
            },
            description: {
                name: 'description',
                label: "Description",
                placeholder: 'Provide description of the evidence',
                required: true,
                value: evidence.description || ""
            },
            id: {
                name: 'id of the evidence',
                label: "ID:",
                placeholder: 'id of the evidence',
                value: evidence.uid || ""
            }
        }
    }




}
