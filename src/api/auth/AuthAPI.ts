import HTTPTransport from '$utils/fetch';
import {
  UserResponse,
  LoginResponse,
  LoginRequest,
  SignUpRequest,
  SignUpResponse,
} from '$api/types';
import { BaseAPI } from '$core/BaseAPI';

const APIInstance = new HTTPTransport('auth/');

export default class AuthAPI extends BaseAPI {
  public request() {
    return APIInstance.get<XMLHttpRequest>('user').then((res) => {
      try {
        return JSON.parse(res.response as string) as UserResponse;
      } catch {
        throw new Error('Failed to parse the response');
      }
    });
  }

  public login(user: LoginRequest) {
    return APIInstance.post<LoginResponse>('signin', {
      data: JSON.stringify(user),
    }).then(({ user_id }) => {
      return user_id;
    });
  }

  public signup(user: SignUpRequest) {
    return APIInstance.post<SignUpResponse>('signup', {
      data: JSON.stringify(user),
    }).then(({ id }) => {
      return id;
    });
  }

  public logout() {
    return APIInstance.post<void>('logout');
  }
}
