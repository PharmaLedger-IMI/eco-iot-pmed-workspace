export default class RestoreCSBEvent extends CustomEvent {
  constructor(eventName, eventData, eventOptions) {
    if (!eventOptions) {
      eventOptions = {
        bubbles: true,
        cancelable: true,
        composed: true
      }
    }

    super(eventName, eventOptions);

    this.data = eventData;
  }
}