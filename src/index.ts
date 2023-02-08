import { Router, Store, initRouter } from '$core';
import initApp from '$utils/initApp';
import { defaultAppState } from '$core/Store';
import './styles/index.css';

declare global {
  interface Window {
    store: Store<AppState>;
    router: Router;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const store = new Store<AppState>(defaultAppState);
  const router = new Router();

  window.router = router;
  window.store = store;

  initRouter(router, store);

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  store.dispatch(initApp);
});
