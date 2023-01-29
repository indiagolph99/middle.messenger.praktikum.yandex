import { LoginForm, NonChat } from '$components';
import { BlockClass } from '$core';
import { Props } from '$core/Block';

export enum Screens {
  Nonchat = 'NonChat',
  Login = 'Login',
}

const map: Record<Screens, BlockClass<Props>> = {
  [Screens.Nonchat]: NonChat,
  [Screens.Login]: LoginForm,
};

export const getScreenComponent = (screen: Screens): BlockClass<Props> => {
  return map[screen];
};
