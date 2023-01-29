import { BlockClass, Store } from '$core';
import { Props } from '$core/Block';

type WithStateProps = { store: Store<AppState> };

export default function withStore<P extends WithStateProps>(
  WrappedBlock: BlockClass<P>,
) {
  // @ts-expect-error No base constructor has the specified
  return class extends WrappedBlock<P> {
    constructor(props: P) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      super({ ...props, store: window.store } as Props);
    }

    __onChangeStoreCallback = () => {
      // @ts-expect-error this is not typed
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      this.setProps({ ...this.props });
    };

    componentDidMount(props: P) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      super.componentDidMount(props);
      window.store.on('changed', this.__onChangeStoreCallback);
    }

    componentWillUnmount() {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      super.componentWillUnmount();
      window.store.off('changed', this.__onChangeStoreCallback);
    }
  } as BlockClass<Omit<P, 'store'>>;
}
