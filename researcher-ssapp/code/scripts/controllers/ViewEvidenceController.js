const commonServices = require("common-services");
const {EvidenceService} = commonServices;
const {WebcController} = WebCardinal.controllers;
const BreadCrumbManager = commonServices.getBreadCrumbManager();

export default class ViewEvidenceController extends BreadCrumbManager {
    constructor(...props) {
        super(...props);

        const prevState = this.getState() || {};
        this.model.evidence_uid = prevState.evidenceID;
        this.model.study_id = prevState.studyID;
        this.model.header = "View Result";

        this.model.breadcrumb = this.setBreadCrumb(
            {
                label: `${this.model.header}`,
                tag: "view-evidence"
            }
        );

        this.EvidenceService = new EvidenceService();
        this.EvidenceService.getEvidence(this.model.evidence_uid, (err, evidence) => {
            if (err){
                return console.log(err);
            }
            this.model = this.getEvidenceDetailsViewModel(evidence);
        });

    }


    getEvidenceDetailsViewModel(evidence) {
        return {
            title: {
                name: 'title',
                id: 'title',
                label: "Title: ",
                placeholder: 'Title of the result',
                required: true,
                value: evidence.title || ""
            },
            subtitle: {
                name: 'subtitle',
                id: 'subtitle',
                label: "Subtitle: ",
                placeholder: 'Subtitle of the result',
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
                placeholder: 'Provide description of the result',
                required: true,
                value: evidence.description || ""
            },
            id: {
                name: 'id of the result',
                label: "ID:",
                placeholder: 'id of the result',
                value: evidence.uid || ""
            }
        }
    }




}
