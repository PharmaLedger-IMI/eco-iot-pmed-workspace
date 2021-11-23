const helpButton = document.querySelector("button[data-tag=\"header:help\"]");
const logoutButton = document.querySelector("button[data-tag=\"header:logout\"]");

if (helpButton) {
    helpButton.addEventListener("click", () => {
        console.log("Help pressed!");
    });
}

if (logoutButton) {
    logoutButton.addEventListener("click", () => {
        let iframeIdentity;
        if (window.frameElement) {
            iframeIdentity = window.frameElement.getAttribute('identity');

            if (!iframeIdentity) {
                throw new Error("App was not loaded from a wallet loader")
            }

            window.parent.document.dispatchEvent(new CustomEvent(iframeIdentity, {
                detail: {status: "sign-out"}
            }));
        }
    });
}