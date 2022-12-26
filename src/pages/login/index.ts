import { renderDOM } from '$core';
import { LoginForm, NonChat } from '$components';

const loginForm = new LoginForm();
const main = new NonChat(loginForm);
renderDOM(main);
