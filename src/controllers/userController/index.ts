/* eslint-disable @typescript-eslint/naming-convention */
import { UsersAPI, AuthAPI } from '$api';
import { ProfilePasswordRequest, ProfileRequest } from '$api/types';

const authAPI = new AuthAPI();
const usersAPI = new UsersAPI();
export default class UserController {
  public getOwnUser() {
    return authAPI.request();
  }

  public findUser(username: string) {
    return usersAPI.requestByUsername(username);
  }

  public updateUser(user: FormData) {
    const {
      email,
      login,
      display_name,
      first_name,
      second_name,
      phone,
      password,
      repeat_password,
    } = Object.fromEntries(user.entries());
    const promises = [
      usersAPI.updateProfile({
        email,
        login,
        display_name,
        first_name,
        second_name,
        phone,
      } as ProfileRequest),
      usersAPI.updatePassword({
        oldPassword: password,
        newPassword: repeat_password,
      } as ProfilePasswordRequest),
    ];

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (user.get('avatar').name !== '') {
      promises.push(usersAPI.updateAvatar(user));
    }

    return Promise.all(promises);
  }
}
