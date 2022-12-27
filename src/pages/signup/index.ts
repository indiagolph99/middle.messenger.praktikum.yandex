import { renderDOM } from '$core';
import { SignUpForm, NonChat } from '$components';

const signUpForm = new SignUpForm();
const main = new NonChat(signUpForm);
renderDOM(main);
