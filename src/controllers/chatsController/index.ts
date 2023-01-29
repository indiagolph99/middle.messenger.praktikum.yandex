import { ChatsAPI } from '$api';
import { CreateChatRequest, UsersRequest } from '$api/chats/types';
import UserController from '$controllers/userController';

const userController = new UserController();
const chatsAPI = new ChatsAPI();
export default class ChatsController {
  public createChat(event: SubmitEvent) {
    const formData = new FormData(event.target as HTMLFormElement);
    const formDataObj = Object.fromEntries(formData.entries());
    return chatsAPI.create(formDataObj as unknown as CreateChatRequest);
  }

  public getChats() {
    return chatsAPI.request().then((chats) => {
      window.store.dispatch({ chats });
    });
  }

  public async addUser(username: string, chatId: string) {
    const user = await userController.findUser(username);
    const payload = {
      users: [user],
      chatId,
    };
    return chatsAPI.updateUsers(payload as UsersRequest);
  }

  public deleteChat(chatId: string) {
    return chatsAPI.delete(chatId);
  }

  public async deleteUser(user: string, chatId: string) {
    const payload = {
      users: [user],
      chatId,
    };
    return chatsAPI.deleteFromChat(payload as UsersRequest);
  }

  public async getUsersFromChat(chatId: string) {
    return chatsAPI.requestFromChat(chatId);
  }

  public async getToken(chatId: string) {
    return chatsAPI.requestToken(chatId).then(({ token }) => token as string);
  }
}
