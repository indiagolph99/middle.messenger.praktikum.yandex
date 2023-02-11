import { Router } from '$core';

const historyPushSpy = jest.spyOn(window.history, 'pushState');

describe('Router module', () => {
  it('Router start calls onRouteChange method', () => {
    const router = new Router();
    const callback = jest.fn();
    router.use('*', callback);
    router.start();

    expect(callback).toBeCalled();
  });

  it('Going by unknown route defaults to wildcard route', () => {
    const router = new Router();
    const callbackDefault = jest.fn();
    router.use('*', callbackDefault);
    router.start();
    router.go('/unknown');

    expect(callbackDefault).toBeCalled();
  });

  it('Going by known route', () => {
    const router = new Router();
    const callbackDefault = jest.fn();
    const callback = jest.fn();
    router.use('*', callbackDefault);
    router.use('/route', callback);
    router.start();
    router.go('/route');

    expect(callback).toBeCalled();
    expect(historyPushSpy).toBeCalled();
  });
});
