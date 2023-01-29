import HTTPTransport from '$utils/fetch';
import { BaseAPI } from '$core/BaseAPI';
import {
  UserResponse,
  ProfileRequest,
  ProfilePasswordRequest,
} from '$api/types';

const apiInstance = new HTTPTransport('user/');

export default class UsersAPI extends BaseAPI {
  public updateProfile(user: ProfileRequest) {
    return apiInstance
      .put<UserResponse>('profile', {
        data: JSON.stringify(user),
      })
      .then((res) => {
        return res;
      });
  }

  public updateAvatar(user: FormData) {
    return apiInstance
      .put<UserResponse>('profile/avatar', {
        data: user,
      })
      .then((res) => {
        return res;
      });
  }

  public updatePassword(user: ProfilePasswordRequest) {
    return apiInstance
      .put<UserResponse>('password', {
        data: JSON.stringify(user),
      })
      .then((res) => {
        return res;
      });
  }

  public requestByUsername(username: string) {
    return apiInstance
      .post<XMLHttpRequest>('search', {
        data: JSON.stringify({ login: username }),
      })
      .then((res) => {
        try {
          const user = JSON.parse(res.response as string) as UserResponse[];
          return user[0].id;
        } catch {
          throw new Error('Failed to parse the response');
        }
      });
  }
}
