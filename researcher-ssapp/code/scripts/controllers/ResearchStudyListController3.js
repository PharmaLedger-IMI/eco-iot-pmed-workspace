const { WebcController } = WebCardinal.controllers;
const { DataSource } = WebCardinal.dataSources;
import StudiesService from "../services/StudiesService.js";


class TestDataSource extends DataSource {
    constructor(...props) {
        super(...props);
        this.model.studies = props[0];
        console.log(this.model.studies)

        async function getIt(a, x){
            a.model.studies = await ab(x);
            console.log(this.model.studies)
        }

        function ab(arxiko){
            return arxiko.then(x => {
                return x
            })
        }


        getIt(this, this.model.studies);

        this.setRecordsNumber(this.model.studies.length);


        this.setPageSize(5);
        this.model.noOfColumns = 4;

    }

    async getPageDataAsync(startOffset, dataLengthForCurrentPage) {

        console.log({startOffset, dataLengthForCurrentPage});
        let slicedData = [];

        this.setRecordsNumber(this.model.studies.length);

        if (dataLengthForCurrentPage > 0) {
            slicedData = Object.entries(this.model.studies).slice(startOffset, startOffset + dataLengthForCurrentPage).map(entry => entry[1]);
            console.log(slicedData)
        } else {
            slicedData = Object.entries(this.model.studies).slice(0, startOffset - dataLengthForCurrentPage).map(entry => entry[1]);
            console.log(slicedData)
        }
        return new Promise((resolve, reject) => {
            console.log(slicedData)
            resolve(slicedData);
        });


}
}

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

        this.model.testDataSource = new TestDataSource(getStudies());
        const { testDataSource } = this.model;

        this.onTagClick("view", (model) => {
            const { title, status } = model;
            this.showModal(title, `Status #${status}`);
        });

        this.onTagClick("prev-page", () => testDataSource.goToPreviousPage());

        this.onTagClick("next-page", () => testDataSource.goToNextPage());

        this.attachHandlerHome();
    }

    attachHandlerHome() {
        this.onTagClick('research:back', () => {
            this.navigateToPageTag('research-study');
        });
    }

}