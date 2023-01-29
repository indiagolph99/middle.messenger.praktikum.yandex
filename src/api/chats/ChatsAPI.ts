import HTTPTransport from '$utils/fetch';
import {
  ChatsResponse,
  CreateChatRequest,
  UsersRequest,
  TokenResponse,
} from '$api/chats/types';
import { BaseAPI } from '$core/BaseAPI';
import { UserResponse } from '$api/auth/types';

const APIInstance = new HTTPTransport('chats/');

export default class ChatsAPI extends BaseAPI {
  public create(body: CreateChatRequest) {
    return APIInstance.post<XMLHttpRequest>('', { data: JSON.stringify(body) });
  }

  public request() {
    return APIInstance.get<XMLHttpRequest>().then((res) => {
      try {
        return JSON.parse(res.response as string) as ChatsResponse[];
      } catch {
        throw new Error('Failed to parse the response');
      }
    });
  }

  public requestToken(chatId: string) {
    return APIInstance.post<XMLHttpRequest>(`token/${chatId}`).then((res) => {
      try {
        return JSON.parse(res.response as string) as Indexed;
      } catch {
        throw new Error('Failed to parse the response');
      }
    });
  }

  public requestFromChat(chatId: string) {
    return APIInstance.get<XMLHttpRequest>(`${chatId}/users`).then((res) => {
      try {
        return JSON.parse(res.response as string) as UserResponse[];
      } catch {
        throw new Error('Failed to parse the response');
      }
    });
  }

  public updateUsers(usersToAdd: UsersRequest) {
    return APIInstance.put<XMLHttpRequest>('users', {
      data: JSON.stringify(usersToAdd),
    });
  }

  public delete(chatId: string) {
    return APIInstance.delete<XMLHttpRequest>('', {
      data: JSON.stringify({ chatId }),
    });
  }

  public deleteFromChat(usersToDelete: UsersRequest) {
    return APIInstance.delete<XMLHttpRequest>('users', {
      data: JSON.stringify(usersToDelete),
    });
  }
}
