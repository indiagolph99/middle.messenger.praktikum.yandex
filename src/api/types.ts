export type APIError = {
  reason: string;
};

export {
  LoginRequest,
  LoginResponse,
  SignUpRequest,
  SignUpResponse,
  UserResponse,
} from '$api/auth/types';

export { ProfilePasswordRequest, ProfileRequest } from '$api/users/types';

export {
  CreateChatRequest,
  ChatsResponse,
  UsersRequest,
} from '$api/chats/types';

export type SocketMessage = {
  content: string;
  type: string;
  chat_id?: 'number';
  time?: 'string';
  user_id?: 'string';
};
