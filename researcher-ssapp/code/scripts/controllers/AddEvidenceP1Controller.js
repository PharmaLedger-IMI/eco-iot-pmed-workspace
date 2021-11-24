const {WebcController} = WebCardinal.controllers;


export default class AddEvidenceP1Controller extends WebcController {
    constructor(...props) {

        super(...props);

        const prevState = this.getState() || {};
        this.model = this.getEvidenceViewModel(prevState);

        this._attachHandlerEvidenceP2();
        this._attachHandlerEvidenceBackMenu();

    }

    _attachHandlerEvidenceP2() {
        this.onTagClick('evidence:add-evidence-p2', (event) => {
            const publisherData = this.prepareEvidencePublisherData();
            this.navigateToPageTag("add-evidence-p2", publisherData);
        });
    }

    _attachHandlerEvidenceBackMenu() {
        this.onTagClick('evidence:back-to-menu', (event) => {
            this.navigateToPageTag('evidence');
        });
    }

    prepareEvidencePublisherData() {
        return {
            name: this.model.name.value,
            organization: this.model.organization.value,
            email: this.model.email.value,
            title: this.model.title.value,
            subtitle: this.model.subtitle.value,
            version: this.model.version.value,
            status: this.model.status.value,
            topics: this.model.topics.value,
            exposureBackground: this.model.exposureBackground.value,
            description: this.model.description.value
        };
    }

    getEvidenceViewModel(prevState) {
        return {
            name: {
                name: 'name',
                id: 'name',
                label: "Name",
                placeholder: 'Name of the Publisher of the Evidence',
                required: true,
                value: prevState.name || ""
            },
            organization: {
                name: 'organization',
                id: 'organization',
                label: "Organization",
                placeholder: 'Organization',
                value: prevState.organization || ""
            },
            email: {
                name: 'email',
                id: 'email',
                label: "Email",
                placeholder: 'Email',
                value: prevState.email || ""
            },
            title: prevState.title || "",
            subtitle: prevState.subtitle || "",
            version: prevState.version || "",
            status: prevState.status || "",
            topics: prevState.topics || "",
            exposureBackground: prevState.exposureBackground || "",
            description: prevState.description || ""
        }
    }

}