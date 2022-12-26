interface RequestOptions {
  timeout?: number;
  data?: XMLHttpRequestBodyInit;
  headers?: Record<string, string>;
  retries?: number;
  method: Values<typeof METHODS>;
}

const METHODS = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

/**
 * Функцию реализовывать здесь необязательно, но может помочь не плодить логику у GET-метода
 * На входе: объект. Пример: {a: 1, b: 2, c: {d: 123}, k: [1, 2, 3]}
 * На выходе: строка. Пример: ?a=1&b=2&c=[object Object]&k=1,2,3
 */
function queryStringify(data: XMLHttpRequestBodyInit) {
  const str = Object.entries(data).reduce((acc, [key, value], index) => {
    // eslint-disable-next-line no-param-reassign
    acc = `${acc}${index === 0 ? '' : '&'}${key}=${
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      Array.isArray(value) ? value.join(',') : value
    }`;
    return acc;
  }, '');

  return `?${str}`;
}

class HTTPTransport {
  get = (url: string, options: RequestOptions) => {
    let format = '';
    if (options.data) {
      format = queryStringify(options.data);
    }

    return this.request(
      `${url}${format}`,
      { ...options, method: METHODS.GET },
      options.timeout,
    );
  };

  post = (url: string, options: RequestOptions) => {
    return this.request(
      url,
      { ...options, method: METHODS.POST },
      options.timeout,
    );
  };

  put = (url: string, options: RequestOptions) => {
    return this.request(
      url,
      { ...options, method: METHODS.PUT },
      options.timeout,
    );
  };

  delete = (url: string, options: RequestOptions) => {
    return this.request(
      url,
      { ...options, method: METHODS.DELETE },
      options.timeout,
    );
  };

  // PUT, POST, DELETE

  // options:
  // headers — obj
  // data — obj
  request = (url: string, options: RequestOptions, timeout = 5000) => {
    const { method, data, headers } = options;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(method, url);

      if (headers) {
        Object.entries(headers).forEach(([key, value]) => {
          xhr.setRequestHeader(key, value);
        });
      }

      xhr.addEventListener('load', function () {
        resolve(xhr);
      });

      xhr.timeout = timeout;
      xhr.addEventListener('abort', reject);
      // eslint-disable-next-line unicorn/prefer-add-event-listener
      xhr.onerror = reject;
      xhr.ontimeout = reject;

      if (method === METHODS.GET || !data) {
        xhr.send();
      } else {
        xhr.send(data);
      }
    });
  };
}
