const { WebcController } = WebCardinal.controllers;


class BreadcrumbNavigatorController extends WebcController {
    constructor(...props) {
        super(...props);
        
        let breadCrumbs = this.model.toObject();

        for (let i = 0; i < breadCrumbs.length-1; i++) {
            for (let k = i+1; k < breadCrumbs.length; k++) {
                if (breadCrumbs[i].tag === breadCrumbs[k].tag) {
                    breadCrumbs[i].state = breadCrumbs[k].state;
                    this.model.splice(i+1,breadCrumbs.length);
                    break;
                }
            }
        }

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