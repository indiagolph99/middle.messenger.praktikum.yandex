import { isPlainObject, getParams } from '$utils/isEqual';

export const APP_PROXY = 'https://ya-praktikum.tech/api/v2/';

interface RequestOptions {
  timeout?: number;
  data?: XMLHttpRequestBodyInit;
  headers?: Record<string, string>;
  retries?: number;
  method?: Values<typeof METHODS>;
  withCredentials?: boolean;
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
  if (!isPlainObject(data)) {
    throw new Error('input must be an object');
  }

  return getParams(data)
    .map((arr) => arr.join('='))
    .join('&');
}

export default class HTTPTransport {
  url: string;

  constructor(url: string) {
    this.url = url;
  }

  get = <Response>(url?: string, options?: RequestOptions): Promise<Response> => {
    let format = '';
    if (options && options.data) {
      format = queryStringify(options.data);
    }

    return this.request(
      `${APP_PROXY}${this.url}${url || ''}/${format}`,
      { ...options, method: METHODS.GET },
      options?.timeout,
    );
  };

  post = <Response>(
    url?: string,
    options?: RequestOptions,
  ): Promise<Response> => {
    return this.request<Response>(
      `${APP_PROXY}${this.url}${url || ''}`,
      {
        ...options,
        method: METHODS.POST,
        headers: {
          ...options?.headers,
        },
      },
      options?.timeout,
    );
  };

  put = <Response>(url: string, options: RequestOptions) => {
    return this.request<Response>(
      `${APP_PROXY}${this.url}${url}`,
      {
        ...options,
        method: METHODS.PUT,
        headers: {
          ...options?.headers,
        },
      },
      options?.timeout,
    );
  };

  delete = <Response>(url: string, options: RequestOptions) => {
    return this.request<Response>(
      `${APP_PROXY}${this.url}${url}`,
      { ...options, method: METHODS.DELETE },
      options?.timeout,
    );
  };

  // PUT, POST, DELETE

  // options:
  // headers — obj
  // data — obj
  request = <Response>(
    url: string,
    options: RequestOptions,
    timeout = 5000,
  ) => {
    const { method, data, headers } = options;

    return new Promise<Response>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(method || 'GET', url);

      if (headers) {
        Object.entries(headers).forEach(([key, value]) => {
          xhr.setRequestHeader(key, value);
        });
      }

      if (!(data instanceof FormData)) {
        xhr.setRequestHeader('content-type', 'application/json');
      }

      xhr.withCredentials = true;
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          resolve(xhr as Response);
        } else {
          reject(xhr);
        }
      });

      xhr.timeout = timeout;
      xhr.addEventListener('abort', reject);
      xhr.addEventListener('error', reject);
      xhr.addEventListener('timeout', reject);

      if (method === METHODS.GET || !data) {
        xhr.send();
      } else {
        xhr.send(data);
      }
    });
  };
}
