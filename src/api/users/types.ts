export type ProfileRequest = {
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  email: string;
  phone: string;
} & XMLHttpRequestBodyInit;

export type ProfilePasswordRequest = {
  oldPassword: string;
  newPassword: string;
} & XMLHttpRequestBodyInit;
