export type LoginRequest = {
  login: string;
  password: string;
} & XMLHttpRequestBodyInit;

export type LoginResponse = {
  user_id: string;
};

export type UserResponse = {
  id: number | string;
  login: string;
  first_name: string;
  second_name: string;
  display_name: string;
  avatar: string;
  phone: string;
  email: string;
};

export type SignUpRequest = {
  first_name: string;
  second_name: string;
  login: string;
  email: string;
  password: string;
  phone: string;
} & XMLHttpRequestBodyInit;

export type SignUpResponse = {
  id: string;
};
