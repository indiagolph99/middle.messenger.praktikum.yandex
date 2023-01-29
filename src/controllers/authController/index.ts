import { AuthAPI } from '$api';
import { LoginRequest, SignUpRequest } from '$api/types';
import transformUser from '$utils/apiTransformers';

const authAPI = new AuthAPI();
export default class AuthController {
  public login(user: LoginRequest) {
    return authAPI
      .login(user)
      .then(() => {
        return authAPI.request();
      })
      .then((userRes) => {
        window.store.dispatch({ user: transformUser(userRes) });
        window.router.go('/chats');
      });
  }

  public signup(user: SignUpRequest) {
    return authAPI
      .signup(user)
      .then(() => {
        return authAPI.request();
      })
      .then((userRes) => {
        window.store.dispatch({ user: transformUser(userRes) });
        window.router.go('/chats');
      });
  }

  public logout() {
    return authAPI.logout().then(() => {
      window.router.go('/login');
    });
  }
}
