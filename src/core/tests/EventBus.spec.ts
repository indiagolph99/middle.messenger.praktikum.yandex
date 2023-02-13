import EventBus from '$core/EventBus';

describe('EventBus module', () => {
  it('event subscription', () => {
    const callback = jest.fn();
    const bus = new EventBus();
    bus.on('test', callback);
    bus.emit('test');

    expect(callback).toBeCalledTimes(1);
  });

  it('event unsubscription', () => {
    const callback = jest.fn();
    const bus = new EventBus();
    bus.on('test', callback);
    bus.off('test', callback);
    bus.emit('test');

    expect(callback).toBeCalledTimes(0);
  });

  it('emit of unregistered event throws an error', () => {
    const bus = new EventBus();
    const callback = () => {
      bus.emit('test');
    };

    expect(callback).toThrowError('No event registered: test');
  });

  it('unsubscription from unregistered event throws an error', () => {
    const bus = new EventBus();
    const callback = () => {
      bus.off('test', jest.fn());
    };

    expect(callback).toThrowError('No event: test');
  });
});
