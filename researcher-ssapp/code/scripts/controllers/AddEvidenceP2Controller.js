const {WebcController} = WebCardinal.controllers;


export default class AddEvidenceP2Controller extends WebcController {
    constructor(...props) {

        super(...props);

        const prevState = this.getState();
        this.model = this.getEvidenceDetailsViewModel(prevState);

        this._attachHandlerEditBacktoP1Button();
        this._attachHandlerAddEvidenceSummaryButton();

    }

    _attachHandlerEditBacktoP1Button() {
        this.onTagClick('evidence:add-evidence-p1', () => {
            this.navigateToPageTag('add-evidence-p1', this.model.toObject());
        });
    }

    _attachHandlerAddEvidenceSummaryButton() {
        this.onTagClick('add-evidence-summary', () => {
            this.navigateToPageTag('add-evidence-summary', this.model.toObject());
        });
    }

    getEvidenceDetailsViewModel(prevState) {
        return {
            title: {
                name: 'title',
                id: 'title',
                label: "Title",
                placeholder: 'Title of the Evidence',
                required: true,
                value: prevState.title || ""
            },
            subtitle: {
                name: 'subtitle',
                id: 'subtitle',
                label: "Subtitle",
                placeholder: 'Subtitle of the Evidence',
                value: prevState.subtitle || ""
            },
            version: {
                name: 'version',
                id: 'Version',
                label: "Version",
                placeholder: 'Version',
                value: prevState.version || ""
            },
            name: prevState.name || "",
            organization: prevState.organization || "",
            email: prevState.email || "",

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
                value: prevState.status || ""
            },
            topics: {
                label: "Topics",
                required: true,
                options: [{
                    label: "Topics 1",
                    value: 'Topics 1'
                },
                    {
                        label: "Topics 2",
                        value: 'Topics 2'
                    },
                    {
                        label: "Topics 3",
                        value: 'Topics 3'
                    }
                ],
                value: prevState.topics || ""
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
                ],
                value: prevState.exposureBackground || ""
            },
            description: {
                name: 'description',
                label: "Description",
                placeholder: 'Provide description of the evidence',
                required: true,
                value: prevState.description || ""
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