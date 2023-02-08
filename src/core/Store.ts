import EventBus from './EventBus';

export type Dispatch<State> = (
  nextStateOrAction: Partial<State> | Action<State>,
  payload?: Record<string, unknown>,
) => void;

export type Action<State> = (
  dispatch: Dispatch<State>,
  state: State,
  payload?: Record<string, unknown>,
) => void;

export const defaultAppState: AppState = {
  appIsInited: false,
  isLoading: false,
  screen: null,
  loginFormError: null,
  user: null,
  chats: [],
  messages: [],
  currentChatUsers: [],
};

export default class Store<
  State extends Record<string, unknown>,
> extends EventBus<'changed', { changed: [State, Partial<State>] }> {
  private state: State = {} as State;

  constructor(defaultState: State) {
    super();

    this.state = defaultState;
  }

  public getState() {
    return this.state;
  }

  public set(nextState: Partial<State>) {
    const prevState = { ...this.state };

    this.state = { ...this.state, ...nextState };

    this.emit('changed', prevState, nextState);
  }

  dispatch(
    nextStateOrAction: Partial<State> | Action<State>,
    payload?: Record<string, unknown>,
  ) {
    if (typeof nextStateOrAction === 'function') {
      nextStateOrAction(this.dispatch.bind(this), this.state, payload);
    } else {
      this.set({ ...this.state, ...nextStateOrAction });
    }
  }
}
