const {addHook} = WebCardinal.preload;

function defineWebCardinalComponents() {
    const {define} = WebCardinal.components;

    define('pharma-container', {shadow: true});
    define('pharma-header');
    define('pharma-footer');
}

addHook('beforeAppLoads', async () => {
    try {
        defineWebCardinalComponents();
    } catch (error) {
        console.error('Error while defining WebCardinal components', error);
    }
});