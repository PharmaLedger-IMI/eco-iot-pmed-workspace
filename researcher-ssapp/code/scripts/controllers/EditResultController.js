const commonServices = require("common-services");
const {ResultsService} = commonServices;
const BreadCrumbManager = commonServices.getBreadCrumbManager();

export default class EditResultController extends BreadCrumbManager {
    constructor(...props) {
        super(...props);

        const prevState = this.getState() || {};
        this.model.result_uid = prevState.resultID;
        this.model.study_id = prevState.studyID;
        this.model.header = "Edit result";

        this.model.breadcrumb = this.setBreadCrumb(
            {
                label: `${this.model.header}`,
                tag: "edit-result"
            }
        );

        this.ResultsService = new ResultsService();
        this.ResultsService.getResult(this.model.result_uid, (err, result) => {
            if (err){
                return console.log(err);
            }
            this.model = this.getResultDetailsViewModel(result);
        });

        this._attachHandlerBackMenu();
        this._attachHandlerEditResult();
    }

    _attachHandlerBackMenu() {
        this.onTagClick('go:back', (event) => {

            let resultState = {
                uid: this.model.study_id, 
                breadcrumb: this.model.toObject('breadcrumb')
            }
            this.navigateToPageTag('results-list', resultState);

        });
    }

    prepareResultDSUData(){
        let result = {
            title: this.model.title.value,
            subtitle: this.model.subtitle.value,
            version: this.model.version.value,
            status: this.model.status.value,
            topics: this.model.topics.value,
            exposureBackground: this.model.exposureBackground.value,
            description: this.model.description.value,
            studyID: this.model.study_id,
            uid: this.model.result_uid,
            filename: this.model.filename
        }
        console.log(result)
        return result;
    }

    updateResult(){
        this.ResultsService.updateResult(this.prepareResultDSUData(), (err, data) => {
            let message = {};

            if (err) {
                message.content = "An error has been occurred!";
                message.type = 'error';
            } else {
                message.content = `The result ${this.model.title.value} has been updated!`;
                message.type = 'success'
            }
            this.navigateToPageTag('results-list', {
                message: message,
                uid: this.model.study_id, 
                breadcrumb: this.model.toObject('breadcrumb')
            });
        })
    }

    _attachHandlerEditResult() {
        this.onTagClick('edit:result', (event) => {
            this.updateResult();
        });
    }

    getResultDetailsViewModel(result) {
        return {
            title: {
                name: 'title',
                id: 'title',
                label: "Title: ",
                placeholder: 'Title of the result',
                required: true,
                value: result.title || ""
            },
            subtitle: {
                name: 'subtitle',
                id: 'subtitle',
                label: "Subtitle: ",
                placeholder: 'Subtitle of the result',
                value: result.subtitle || ""
            },
            version: {
                name: 'version',
                id: 'Version',
                label: "Version",
                placeholder: 'Version',
                value: result.version || ""
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
                value: result.status || ""
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
                value: result.topics || ""
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
                value: result.exposureBackground || ""
            },
            description: {
                name: 'description',
                label: "Description",
                placeholder: 'Provide description of the result',
                required: true,
                value: result.description || ""
            },
            id: {
                name: 'id of the result',
                label: "ID:",
                placeholder: 'id of the result',
                value: result.uid || ""
            },
            filename: result.filename
        }
    }




}
