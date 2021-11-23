class LoaderCommunication {
    constructor() {
        if (window.frameElement) {
            this.iframeIdentity = window.frameElement.getAttribute('identity');

            if (!this.iframeIdentity) {
                throw new Error("App was not loaded from a wallet loader")
            }
        }
    }

    sendMessage(data) {
        window.parent.document.dispatchEvent(new CustomEvent(this.iframeIdentity, {
            detail: data
        }));
    }
}

export default new LoaderCommunication();