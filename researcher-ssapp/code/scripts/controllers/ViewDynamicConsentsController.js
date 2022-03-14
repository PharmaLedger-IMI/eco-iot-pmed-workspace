import mock from './mock/dynamic-consents.js';

const { WebcController } = WebCardinal.controllers;
const { DataSource } = WebCardinal.dataSources;

class DynamicConsentsDataSource extends DataSource {
    constructor(...props) {
        super(...props);

        this.setPageSize(10);

        this.walletStorage = mock.getDynamicConsentsStorage();
        this.walletStorage
            .countRecordsAsync()
            .then((recordsNumber) => this.setRecordsNumber(recordsNumber))
            .catch((error) => console.error(error));
    }

    /**
     * @override
     */
    async getPageDataAsync(startOffset, dataLengthForCurrentPage) {
        return await this.walletStorage.filterRecordsAsync(
            startOffset,
            dataLengthForCurrentPage
        );
    }
}

export default class ViewDynamicConsentsController extends WebcController {
    constructor(...props) {
        super(...props);

        this.model = {
            datasource: new DynamicConsentsDataSource(),
        };

        let state =  this.getState();
        let {breadcrumb, ...breadcrumbState} = state;
        this.model = state;
        let breadcrumbSegment = {
            label: "Dynamic Consent: " + this.model.studyId,
            tag: "dynamic-consents",
            state: breadcrumbState
        };

        this.model.breadcrumb.push(breadcrumbSegment);
        const { datasource } = this.model;

        this.onTagClick("prev-page", () => datasource.goToPreviousPage());
        this.onTagClick("next-page", () => datasource.goToNextPage());
        this.onTagClick("view-graphs",() => {
            let studyState = {
            studyId: this.model.studyId,
            breadcrumb:this.model.breadcrumb.toObject()
            }
            this.navigateToPageTag("dynamic-consents-graphs", studyState)
        });
    }
}