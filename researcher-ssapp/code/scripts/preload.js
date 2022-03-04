const {addControllers, addHook} = WebCardinal.preload;

function defineWebCardinalComponents() {
    const {define} = WebCardinal.components;

    define('breadcrumb-navigator');
}

addHook('beforeAppLoads', async () => {
    try {
        defineWebCardinalComponents();
        const {BreadcrumbNavigatorController} = await import("../components/breadcrumb-navigator/BreadcrumbNavigatorController.js");
        addControllers({BreadcrumbNavigatorController});
    } catch (error) {
        console.error('Error while defining WebCardinal components', error);
    }
});