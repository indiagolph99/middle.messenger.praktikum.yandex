export class BaseAPI {
  create(body?: XMLHttpRequestBodyInit) {
    throw new Error('Not implemented');
  }

  request(body?: XMLHttpRequestBodyInit) {
    throw new Error('Not implemented');
  }

  update() {
    throw new Error('Not implemented');
  }

  delete(body?: XMLHttpRequestBodyInit) {
    throw new Error('Not implemented');
  }
}
