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

        this.model.studyId =  this.history.location.state.studyId
        const { datasource } = this.model;


        this.onTagClick("prev-page", () => datasource.goToPreviousPage());
        this.onTagClick("next-page", () => datasource.goToNextPage());
    }
}