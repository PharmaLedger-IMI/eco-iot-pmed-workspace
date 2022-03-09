import EvidenceService from "../services/EvidenceService.js";
const {WebcController} = WebCardinal.controllers;


export default class ViewEditEvidenceController extends WebcController {
    constructor(...props) {
        super(...props);

        const prevState = this.getState() || {};
        this.model.evidence_uid = prevState.evidenceID;
        this.model.study_id = prevState.studyID;
        this.model.status = prevState.status;

        if (this.model.status === "edit"){
            this.model.inEditMode = true;
            this.model.header = "Edit Evidence";
        }
        else{
            this.model.inEditMode = false;
            this.model.header = "View Evidence";
        }

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
            this.navigateToPageTag('evidence-list', this.model.study_id);
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
            if (err) {
                this.navigateToPageTag('confirmation-page', {
                    confirmationMessage: "An error has been occurred!",
                    redirectPage: "home"
                });
                return console.log(err);
            }
            this.navigateToPageTag('confirmation-page', {
                confirmationMessage: "The evidence has been updated!",
                redirectPage: "home"
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
                disabled: !this.model.inEditMode,
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
                disabled: !this.model.inEditMode,
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
