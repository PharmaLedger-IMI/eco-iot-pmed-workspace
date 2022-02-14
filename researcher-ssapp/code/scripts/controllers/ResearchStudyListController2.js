const { WebcController } = WebCardinal.controllers;
const { DataSource } = WebCardinal.dataSources;
import StudiesService from "../services/StudiesService.js";


class TestDataSource extends DataSource {
    constructor(...props) {
        super(...props);
        this.model.studies = props[0];
        console.log(this.model.studies)

        async function getIt(x){
            let a = await ab(x);
            console.log(a)
        }

        function ab(arxiko){
            return arxiko;
        }

        getIt(this.model.studies);



        this.setPageSize(5);
        this.model.noOfColumns = 4;

    }

    async getPageDataAsync(startOffset, dataLengthForCurrentPage) {
        console.log({startOffset, dataLengthForCurrentPage});
        let sData = {}
        let slicedData = [];
        this.model.studies.then(studies => {

            this.setRecordsNumber(studies.length);


            if (dataLengthForCurrentPage > 0) {
                //sData = Object.entries(studies).slice(startOffset, startOffset + dataLengthForCurrentPage)
                //sData.forEach(element => (slicedData.push( element.slice(0))))
                //slicedData = newArrayDataOfOjbect.slice(startOffset, startOffset + dataLengthForCurrentPage);
                slicedData = Object.entries(studies).slice(startOffset, startOffset + dataLengthForCurrentPage).map(entry => entry[1]);
                console.log(slicedData)
            } else {
                //sData = Object.entries(studies).slice(0, startOffset - dataLengthForCurrentPage)
                slicedData = Object.entries(studies).slice(0, startOffset - dataLengthForCurrentPage).map(entry => entry[1]);
                console.log(slicedData)
                //slicedData = newArrayDataOfOjbect.slice(startOffset, startOffset + dataLengthForCurrentPage);
                //slicedData = Object.entries(studies).slice(0, startOffset - dataLengthForCurrentPage).map(entry => entry);
            }
            return new Promise((resolve, reject) => {
                console.log(slicedData)
                resolve(slicedData);
            });
            // return [{
            //     title: "Research Study 1",
            //     participants: "treatment",
            //     status: "phase-1",
            // },
            //     {
            //         title: "Research Study 2",
            //         participants: "treatment",
            //         status: "phase-1",
            //     },
            //     {
            //         title: "Research Study 3",
            //         participants: "treatment",
            //         status: "phase-1",
            //     }]
        })

        // let a = [{
        //     title: "Research Study 1",
        //     participants: "treatment",
        //     status: "phase-1",
        // },
        //     {
        //         title: "Research Study 2",
        //         participants: "treatment",
        //         status: "phase-1",
        //     },
        //     {
        //         title: "Research Study 3",
        //         participants: "treatment",
        //         status: "phase-1",
        //     }]
        // return a
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

        // this.onTagClick("prev-page", () => testDataSource.goToPreviousPage());
        //
        // this.onTagClick("next-page", () => testDataSource.goToNextPage());

        this.attachHandlerHome();
    }

    attachHandlerHome() {
        this.onTagClick('research:back', () => {
            this.navigateToPageTag('research-study');
        });
    }

}