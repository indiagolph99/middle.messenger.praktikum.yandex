import AuthAPI from '$api/auth/AuthAPI';
import type { Dispatch } from '$core/Store';
import transformUser from '$utils/apiTransformers';
import apiHasError from '$utils/apiHasError';

export default async function initApp(dispatch: Dispatch<AppState>) {
  try {
    const userAPI = new AuthAPI();
    const response = await userAPI.request();

    if (apiHasError(response)) {
      return;
    }

    dispatch({ user: transformUser(response) });
    window.router.go(window.location.pathname === '/' ? '/messenger' : window.location.pathname);
  } catch (error) {
    window.router.go('/login');
    console.error(error);
  } finally {
    dispatch({ appIsInited: true });
  }
}
