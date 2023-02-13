import { ChatsResponse } from '$api/chats/types';
import { SocketMessage, UserResponse } from '$api/types';

declare global {
  export type Nullable<T> = T | null;

  export type Keys<T extends Record<string, unknown>> = keyof T;
  export type Values<T extends Record<string, unknown>> = T[Keys<T>];

  export type Indexed = { [key: string]: unknown };

  export type User = {
    id: number | string;
    login: string;
    firstName: string;
    secondName: string;
    displayName: string;
    avatar: string;
    phone: string;
    email: string;
  };

  export type AppState = {
    appIsInited: boolean;
    screen: Screens | null;
    isLoading: boolean;
    loginFormError: string | null;
    user: User | null;
    chats: ChatsResponse[];
    currentChat?: { id: string; title: string; avatar?: string };
    messages: SocketMessage[];
    currentChatUsers: UserResponse[];
  };
}

export {};
