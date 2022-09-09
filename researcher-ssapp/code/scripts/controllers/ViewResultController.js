const commonServices = require("common-services");
const {ResultsService} = commonServices;
const BreadCrumbManager = commonServices.getBreadCrumbManager();
const FileDownloaderService = commonServices.FileDownloaderService;

export default class ViewResultController extends BreadCrumbManager {
    constructor(...props) {
        super(...props);

        const prevState = this.getState() || {};
        this.model.result_uid = prevState.resultID;
        this.model.study_id = prevState.studyID;
        this.model.header = "View Result";

        this.model.breadcrumb = this.setBreadCrumb(
            {
                label: `${this.model.header}`,
                tag: "view-result"
            }
        );

        this._attachHandlerDownload();
        this.fileDownloaderService = new FileDownloaderService(this.DSUStorage);

        this.ResultsService = new ResultsService();
        this.ResultsService.getResult(this.model.result_uid, (err, result) => {
            if (err){
                return console.log(err);
            }
            this.model = this.getResultDetailsViewModel(result);
        });

    }

    getResultFilePath(uid) {
        return 'results' + '/' + uid+ '/files/';
    }

    _attachHandlerDownload() {
        this.onTagClick('download-file', async (model, target, event) => {
            if (this.model.filename) {
                let path = this.getResultFilePath(this.model.id.value);
                await this.fileDownloaderService.prepareDownloadFromDsu(path, this.model.filename);
                this.fileDownloaderService.downloadFileToDevice(this.model.filename);
            }
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
            attachedFile: {
                name: "file uploaded",
                label: "File Uploaded",
                placeholder: "File uploaded",
                button: result.filename ? "Download" : "Not uploaded"
            },
            filename: result.filename,
            checkForFile: result.filename ? false:true
        }
    }



}
