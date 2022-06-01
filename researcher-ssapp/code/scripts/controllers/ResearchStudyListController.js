const { WebcController } = WebCardinal.controllers;
const commonServices = require("common-services");
const {StudiesService} = commonServices;
const DataSourceFactory = commonServices.getDataSourceFactory();


export default class ResearchStudyListController extends WebcController {
    constructor(...props) {
        super(...props);

        this.StudiesService = new StudiesService();

        const getStudies = () => {
            return new Promise ((resolve, reject) => {
                this.StudiesService.getStudies((err, received_studies ) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(received_studies)
                })
            })
        }

        getStudies().then(data => {
            this.model.testDataSource = DataSourceFactory(4, 5, data);
            const { testDataSource } = this.model;
            this.onTagClick("view", (model) => {
                const { title, status } = model;
                this.showModal(title, `Status #${status}`);
            });
            this.onTagClick("prev-page", () => testDataSource.goToPreviousPage());
            this.onTagClick("next-page", () => testDataSource.goToNextPage());
        })

        this.attachHandlerHome();
    }

    attachHandlerHome() {
        this.onTagClick('research:back', () => {
            this.navigateToPageTag('research-study');
        });
    }

}