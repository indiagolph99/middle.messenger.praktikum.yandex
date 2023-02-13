import XHRMock from '$utils/fetch/xhr.mock';
import HTTPTransport from '$utils/fetch';

function generateXHRMock(mock: XHRMock) {
  window.XMLHttpRequest = jest.fn(
    () => mock,
  ) as unknown as typeof XMLHttpRequest;
}

describe('request method', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('request method uses GET by default', async () => {
    const xhrMock = new XHRMock(true, false, false, false, 200);
    generateXHRMock(xhrMock);
    const transport = new HTTPTransport('/');
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    await transport.request('foo', {});
    expect(xhrMock.open).toBeCalledWith('GET', 'foo');
  });

  it('request method uses specified method', async () => {
    const xhrMock = new XHRMock(true, false, false, false, 200);
    generateXHRMock(xhrMock);
    const transport = new HTTPTransport('/');
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    await transport.request('foo', { method: 'POST' });
    expect(xhrMock.open).toBeCalledWith('POST', 'foo');
  });

  it('request method sets headers if provided', async () => {
    const xhrMock = new XHRMock(true, false, false, false, 200);
    generateXHRMock(xhrMock);
    const transport = new HTTPTransport('/');
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    await transport.request('foo', { headers: { foo: 'bar' } });
    expect(xhrMock.setRequestHeader).toBeCalledWith('foo', 'bar');
  });

  it('request method sets application/json if data exists', async () => {
    const xhrMock = new XHRMock(true, false, false, false, 200);
    generateXHRMock(xhrMock);
    const transport = new HTTPTransport('/');
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    await transport.request('foo', { data: {} as XMLHttpRequestBodyInit });
    expect(xhrMock.setRequestHeader).toBeCalledWith(
      'content-type',
      'application/json',
    );
  });

  it('request method resolves on 200 OK', async () => {
    const xhrMock = new XHRMock(true, false, false, false, 200);
    generateXHRMock(xhrMock);
    const transport = new HTTPTransport('/');
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    const fn = () =>
      transport.request('foo', { data: {} as XMLHttpRequestBodyInit });
    await expect(fn()).resolves.toBe(xhrMock);
  });

  it('request method rejects if not 200 OK', async () => {
    const xhrMock = new XHRMock(true, false, false, false, 500);
    generateXHRMock(xhrMock);
    const transport = new HTTPTransport('/');
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    const fn = () =>
      transport.request('foo', { data: {} as XMLHttpRequestBodyInit });
    await expect(fn()).rejects.toBe(xhrMock);
  });

  it('request method rejects aborted', async () => {
    const xhrMock = new XHRMock(false, true, false, false);
    generateXHRMock(xhrMock);
    const transport = new HTTPTransport('/');
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    const fn = () =>
      transport.request('foo', { data: {} as XMLHttpRequestBodyInit });
    await expect(fn()).rejects.toBeUndefined();
  });

  it('request method rejects on error', async () => {
    const xhrMock = new XHRMock(false, false, true, false);
    generateXHRMock(xhrMock);
    const transport = new HTTPTransport('/');
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    const fn = () =>
      transport.request('foo', { data: {} as XMLHttpRequestBodyInit });
    await expect(fn()).rejects.toBeUndefined();
  });

  it('request method rejects on timeout', async () => {
    const xhrMock = new XHRMock(false, false, false, true);
    generateXHRMock(xhrMock);
    const transport = new HTTPTransport('/');
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    const fn = () =>
      transport.request('foo', { data: {} as XMLHttpRequestBodyInit });
    await expect(fn()).rejects.toBeUndefined();
  });
});

describe('HTTPTransport class', () => {
  test('get method with data', async () => {
    const requestMock = jest
      .spyOn(HTTPTransport.prototype, 'request')
      .mockImplementation(jest.fn());
    const transport = new HTTPTransport('');
    await transport.get('api', {
      data: { foo: 'bar' } as unknown as XMLHttpRequestBodyInit,
    });

    expect(requestMock).toBeCalledWith(
      'https://ya-praktikum.tech/api/v2/api/foo=bar',
      { data: { foo: 'bar' }, method: 'GET' },
      // eslint-disable-next-line unicorn/no-useless-undefined
      undefined,
    );
  });

  test('get method without data', async () => {
    const requestMock = jest
      .spyOn(HTTPTransport.prototype, 'request')
      .mockImplementation(jest.fn());
    const transport = new HTTPTransport('');
    await transport.get('api');

    expect(requestMock).toBeCalledWith(
      'https://ya-praktikum.tech/api/v2/api/',
      { method: 'GET' },
      // eslint-disable-next-line unicorn/no-useless-undefined
      undefined,
    );
  });

  test('post method', async () => {
    const requestMock = jest
      .spyOn(HTTPTransport.prototype, 'request')
      .mockImplementation(jest.fn());
    const transport = new HTTPTransport('');
    await transport.post('api', {
      data: { foo: 'bar' } as unknown as XMLHttpRequestBodyInit,
    });

    expect(requestMock).toBeCalledWith(
      'https://ya-praktikum.tech/api/v2/api',
      { data: { foo: 'bar' }, method: 'POST', headers: {} },
      // eslint-disable-next-line unicorn/no-useless-undefined
      undefined,
    );
  });

  test('put method', async () => {
    const requestMock = jest
      .spyOn(HTTPTransport.prototype, 'request')
      .mockImplementation(jest.fn());
    const transport = new HTTPTransport('');
    await transport.put('api', {
      data: { foo: 'bar' } as unknown as XMLHttpRequestBodyInit,
    });

    expect(requestMock).toBeCalledWith(
      'https://ya-praktikum.tech/api/v2/api',
      { data: { foo: 'bar' }, method: 'PUT', headers: {} },
      // eslint-disable-next-line unicorn/no-useless-undefined
      undefined,
    );
  });

  test('delete method', async () => {
    const requestMock = jest
      .spyOn(HTTPTransport.prototype, 'request')
      .mockImplementation(jest.fn());
    const transport = new HTTPTransport('');
    await transport.delete('api', {});

    expect(requestMock).toBeCalledWith(
      'https://ya-praktikum.tech/api/v2/api',
      { method: 'DELETE' },
      // eslint-disable-next-line unicorn/no-useless-undefined
      undefined,
    );
  });
});
