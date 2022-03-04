const { WebcController } = WebCardinal.controllers;


class BreadcrumbNavigatorController extends WebcController {
    constructor(...props) {
        super(...props);

        this.model.forEach((segment, index)=>{
            segment.disabled = index === this.model.length-1;
        })

        const breadcrumb = this.model.toObject();

        this.onTagClick("breadcrumb-click",(segmentModel)=>{

           let spliceIndex =  breadcrumb.findIndex(segment=>{
                return segment.tag === segmentModel.tag;
            })

            if (spliceIndex > -1) {
                breadcrumb.splice(spliceIndex);
            }

            this.navigateToPageTag(segmentModel.tag, {...segmentModel.state, breadcrumb:breadcrumb});
        })

    }

}

export { BreadcrumbNavigatorController };