export default class XHRMock {
  timeout?: number;

  open?: jest.Mock;

  setRequestHeader?: jest.Mock;

  withCredentials?: boolean;

  send?: jest.Mock;

  status?: number;

  method?: string;

  load?: boolean;

  abort?: boolean;

  error?: boolean;

  timeoutEvent?: boolean;

  constructor(
    load: boolean,
    abort: boolean,
    error: boolean,
    timeoutEvent: boolean,
    status?: number,
  ) {
    this.status = status;
    this.open = jest.fn();
    this.setRequestHeader = jest.fn();
    this.send = jest.fn();
    this.withCredentials = false;
    this.load = load || false;
    this.abort = abort || false;
    this.error = error || false;
    this.timeoutEvent = timeoutEvent || false;
  }

  addEventListener(
    event: 'load' | 'error' | 'abort' | 'timeoutEvent',
    callback: () => void,
  ) {
    if (event === 'timeoutEvent' && this.timeoutEvent) {
      callback();
    } else if (this[event]) {
      callback();
    }
  }
}
