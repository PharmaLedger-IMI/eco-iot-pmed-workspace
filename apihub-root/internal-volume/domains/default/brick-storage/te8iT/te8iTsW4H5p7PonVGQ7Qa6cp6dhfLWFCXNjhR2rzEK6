import PskBindableModel from "./lib/bindableModel.js";
import DSUStorage from "./lib/DSUStorage.js";
import History from "./lib/History.js";

export default class ContainerController {

  constructor(element, history) {
    this.element = element;
    this.DSUStorage = new DSUStorage();
    this.History = new History(element, history);
    this.modalsUrls = null;

    let modelReadyCallbacks = [];

    let dispatchModel = function (bindValue, model, callback) {
      if (bindValue && model[bindValue]) {
        callback(null, model[bindValue])
      }

      if (!bindValue) {
        callback(null, model);
      }
    };

    let __initGetModelEventListener = () => {
      element.addEventListener("getModelEvent", (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();

        let {
          bindValue,
          callback
        } = e.detail;

        if (typeof callback === "function") {
          return this.onModelReady(() => {
            dispatchModel(bindValue, this.model, callback)
          })
        }

        callback(new Error("No callback provided"));
      });
    };

    let notifyModelReady = () => {
      modelReadyCallbacks.forEach(callback => {
        callback();
      });
    };


    this.setModel = (model) => {
      this.model = PskBindableModel.setModel(model);
      notifyModelReady();
      return this.model;
    };

    this.onModelReady = (callback) => {
      if (typeof this.model !== 'undefined') {
        return callback();
      }
      modelReadyCallbacks.push(callback);
    };


    __initGetModelEventListener();
  }

  /**
   * This method is registering a function that will be executed when an event is triggered.
   * @param {string} eventName - The name of the event
   * @param {Function} listener - The function that will be executed when he event is triggered
   * @param {null | boolean | Object} options - The options for the listener. Full options documentation can be found at: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
   * @throws {string} - error in case any argument is invalid
   */
  on(eventName, listener, options) {
    try {
      this._checkArguments(eventName, listener, options);
      this.element.addEventListener(eventName, listener, options);
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * This method removes a registered event, so the registered function will not be executed anymore.
   * The important notice is that the event which will be unregistered must have the same arguments as the registered event, otherwise it will not be removed.
   * @param {string} eventName - The name of the event
   * @param {Function} listener - The function that will be executed when he event is triggered
   * @param {null | boolean | Object} options - The options for the listener. Full options documentation can be found at: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
   * @throws {string} - error in case any argument is invalid
   */
  off(eventName, listener, options) {
    try {
      this._checkArguments(eventName, listener, options);
      this.element.removeEventListener(eventName, listener, options);
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * This creates a custom event and then is dispatched.
   * @param {string} eventName - The name of the event
   * @param {any | null} data - The data to be sent with the event. This argument can be empty or null.
   * @param {Object | null} options - The options that will be set to the event (bubbles, cancelable, composed...). Full list of options can be found here: https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
   */
  send(eventName, data, options) {
    if (!options) {
      options = {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: data
      };
    }

    if (!eventName || eventName.trim().length === 0) {
      throw new Error(`
      Argument eventName is not valid. It must bea non-empty string.
      Provided value: ${eventName}
      `);
    }

    this.element.dispatchEvent(new CustomEvent(eventName, options));
  }

  /**
   * This function validates the arguments for on and off methods
   * @param {string} eventName - The name of the event
   * @param {Function} listener - The function that will be executed when he event is triggered
   * @param {null | boolean | Object} options - The options for the listener.
   * @throws {string} - error in case any argument is invalid
   */
  _checkArguments(eventName, listener, options) {
    if (typeof eventName !== 'string' || eventName.trim().length === 0) {
      throw new Error(`
      Argument eventName is not valid. It must be a non-empty string.
      Provided value: ${eventName}
      `);
    }

    if (typeof listener !== 'function') {
      throw new Error(`
      Argument listener is not valid, it must be a function.
      Provided value: ${listener}
      `);
    }

    if (options && typeof options !== 'boolean' && typeof options !== 'object') {
      throw new Error(`
      Argument options is not valid, it must a boolean (true/false) in case of capture, or an options object.
      If no options are needed, this argument can be left empty.
      Provided value: ${options}
      `);
    }
  }

  __getModalsUrl(callback) {
   if (this.modalsUrls) {
      return callback(undefined, this.modalsUrls);
    }

    let event = new CustomEvent("getModals", {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail: callback
    });

    this.element.dispatchEvent(event);
  }

  __constructModalElement(modalUrl) {
    let modal = this.element.querySelector("psk-page-loader[data-type=modal]");

    if (!modal) {
      modal = document.createElement("psk-page-loader");
      this.element.append(modal);
      modal.setAttribute("data-type", "modal");
    }
    modal.setAttribute("page-url", modalUrl);
  }


  /* psk-modal functions */
  showModal(modalName, bindContextData, returnCallback) {

    const completeCallback = (...args) => {
      this.hideModal();
      console.log('Hide modal is called from completeCallback');
      returnCallback(...args);
    };

    const bindModalDataHandler = function (evt) {
      let callback = evt.data.callback;
      callback(undefined, bindContextData, completeCallback);
    };

    this.__getModalsUrl((err, modalsUrls) => {

      if (err) {
        console.error("Modals error:" + err.message);
        return ;
      }

      this.modalsUrls = modalsUrls;

      if (!this.modalsUrls) {
        console.error("Modal " + modalName + "is not configured");
        return ;
      }


      let appModalPath = modalsUrls[modalName];
      if (!appModalPath) {
        return console.error(`Modal with name ${modalName} does not exists. Did you forgot to add it in config.json?`)
      }
      this.__constructModalElement(appModalPath);

      this.element.addEventListener("bindModalData", bindModalDataHandler);
      this.element.addEventListener("closeModal", this.hideModal.bind(this, bindModalDataHandler));
    });
  }

  hideModal(eventHandlerToRemove) {
    let modal = this.element.querySelector("psk-page-loader[data-type=modal]");
    if (modal) {
      modal.remove();
    }

    if (eventHandlerToRemove) {
      this.element.removeEventListener('bindModalData', eventHandlerToRemove);
    }
  }

  showFeedbackMessage(errMessage, title, type) {
    title = title ? title : 'Message';
    type = type ? type : 'alert';
    if (typeof this.feedbackEmitter === "function") {
      this.feedbackEmitter(errMessage, title, type);
    } else {
      console.log("Log user relevant messages & Errors:", errMessage);
      alert(errMessage)
    }
  }

  showError(err, title, type) {
    let errMessage;
    title = title ? title : 'Validation Error';
    type = type ? type : 'alert-danger';

    if (err instanceof Error) {
      errMessage = err.message;
    } else if (typeof err === 'object') {
      errMessage = err.toString();
    } else {
      errMessage = err;
    }
    this.showFeedbackMessage(errMessage, title, type);
  }

  showErrorModalAndRedirect(errorText, page, timeout) {
    if (!timeout) {
      timeout = 5000;
    }
    this.element.dispatchEvent(new Event('closeModal'));
    this.showModal('loadingModal', {
      title: 'Error',
      description: errorText
    });
    setTimeout(() => {
      this.element.dispatchEvent(new Event('closeModal'));
      this.History.navigateToPageByTag(page);
    }, timeout)
  }

  displayModal(message, title) {
    if(!title){
      title = "Info";
    }
    this.showModal('loadingModal', {
      title: title,
      description: message
    });
  }


  closeModal() {
    this.element.dispatchEvent(new Event('closeModal'));
  }
}
