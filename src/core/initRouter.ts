import Store from '$core/Store';
import renderDOM from '$core/renderDOM';
import Router from '$core/Router';
import { Info, LoginForm, NotFound, SignUpForm } from '$components';
import { Props, BlockClass } from '$core/Block';
import { Main } from '$pages';

const routes = [
  {
    path: '/login',
    block: LoginForm,
    shouldAuthorized: false,
  },
  {
    path: '/signup',
    block: SignUpForm,
    shouldAuthorized: false,
  },
  {
    path: '/info',
    block: Info,
    shouldAuthorized: true,
  },
  {
    path: '/chats',
    block: Main,
    shouldAuthorized: true,
  },
  {
    path: '*',
    block: NotFound,
    shouldAuthorized: false,
  },
];

export default function initRouter(router: Router, store: Store<AppState>) {
  routes.forEach((route) => {
    router.use(route.path, () => {
      const isAuthorized = Boolean(store.getState().user);
      const currentScreen = Boolean(store.getState().screen);

      if (isAuthorized || !route.shouldAuthorized) {
        store.dispatch({ screen: route.block });
      }

      if (!currentScreen) {
        store.dispatch({ screen: LoginForm });
      }
    });
  });

  store.on('changed', (prevState: AppState, nextState: Partial<AppState>) => {
    if (!prevState.appIsInited && nextState.appIsInited) {
      router.start();
    }

    if (prevState.screen !== nextState.screen) {
      const Page = nextState.screen as BlockClass<Props>;
      renderDOM(new Page({}));
      document.title = `${Page.componentName || ''}`;
    }
  });
}
