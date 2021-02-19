class History {

  constructor(element, history) {
    this.element = element;
    this.history = history;
  }

  navigateToPageByTag(pageTag, state) {
    this.__getTagPage(pageTag, (err, pageUrl) => {

      if(!err){
        this.navigateToPageByUrl(pageUrl, state);
      }

    })
  }

  navigateToPageByUrl(pageUrl, state) {
    let historyPushProps = {
      pathname: pageUrl,
    }
    if (state) {
      historyPushProps['state'] = state
    }
    this.history.push(historyPushProps);
  }

  getState() {
    //TODO refactor this;
    return this.history.win.history.state.state;
  }


  __getTagPage(tag, callback) {
    this.element.dispatchEvent(new CustomEvent("getTags",
      {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail:
          (err, data) => {
            if (err) {
              return callback(err);
            }
            if(!data[tag]){
              return callback(new Error(`No page with tag: '${tag}'`));
            }
            callback(undefined, data[tag])

          }
      }));
  }

}

export default History;
