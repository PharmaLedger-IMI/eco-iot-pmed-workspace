const commonServices = require("common-services");
const DidService = commonServices.DidService;

customElements.define(
    'share-did',
    class _ extends HTMLElement {
        constructor() {
            super();

            this.innerHTML = `
                    <link rel="stylesheet" href="./components/share-did/share-did.css">
                    <div class="input-group share-did p-2">
                        <input type="text" class="form-control share-did-input" readonly value="" placeholder="Loading DID...">
                        <div class="input-group-append">
                        <span data-tooltip="Copy DID to clipboard" data-flow="right" class="did-tooltip">
                            <button class="btn btn-outline-secondary share-did-btn" type="button">
                                <i class="fa fa-share"></i>
                            </button>
                          </span>
                        </div>
                    </div>
        `;

            const didInput = this.querySelector('input');
            const shareBtn = this.querySelector('.share-did-btn');
            const tooltip = this.querySelector(".did-tooltip");
            const tooltipText = tooltip.getAttribute("data-tooltip");
            shareBtn.addEventListener("click", () => {
                navigator.clipboard.writeText(didInput.value);
                tooltip.setAttribute("data-tooltip", "Copied");

                const mouseOverHandler = () => {
                    tooltip.setAttribute("data-tooltip", tooltipText);
                    tooltip.removeEventListener("mouseover", mouseOverHandler);
                };
                tooltip.addEventListener("mouseover", mouseOverHandler);
            });

            DidService.getDidServiceInstance().getDID().then(did => {
                didInput.value = did;
            });
        }
    }
);