import { UserResponse } from '$api/auth/types';

export type CreateChatRequest = {
  title: string;
} & XMLHttpRequestBodyInit;

export type ChatsResponse = {
  id: string;
  title: string;
  avatar: string;
  unread_count: string;
  last_message: {
    user: UserResponse;
    time: string;
    content: string;
  };
};

export type UsersRequest = {
  users: (string | number)[];
  chatId: string;
} & XMLHttpRequestBodyInit;

export type TokenResponse = {
  token: string;
};
