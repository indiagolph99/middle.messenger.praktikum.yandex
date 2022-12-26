import { AuthForm } from '$components';
import { Block } from '$core';
import { FormItemProps } from '$components/formItem';
import {
  ALNU_HYPHEN_UNDERSCORE,
  ALPHA_REQUIRED,
  CAPITAL_REQUIRED,
  DIGIT_REQUIRED,
} from '$utils/regexps';

export default class LoginForm extends Block {
  constructor() {
    const itemsConfig = [
      { inputProps: { name: 'login', placeholder: 'Login' } },
      {
        inputProps: {
          name: 'password',
          type: 'password',
          placeholder: 'Password',
        },
      },
    ] as FormItemProps[];

    const rules = {
      login: [
        {
          required: true,
          min: 3,
          max: 20,
          pattern: ALNU_HYPHEN_UNDERSCORE.pattern,
          message: ALNU_HYPHEN_UNDERSCORE.message,
        },
        {
          pattern: ALPHA_REQUIRED.pattern,
          message: ALPHA_REQUIRED.message,
        },
      ],
      password: [
        {
          required: true,
          min: 8,
          max: 40,
          pattern: CAPITAL_REQUIRED.pattern,
          message: CAPITAL_REQUIRED.message,
        },
        {
          pattern: DIGIT_REQUIRED.pattern,
          message: DIGIT_REQUIRED.message,
        },
      ],
    };

    const authForm = new AuthForm(
      {
        title: 'Login',
        linkTitle: 'Sign up',
        linkHref: '#',
        formConfig: {
          itemsConfig,
          formId: 'login',
          buttonConfig: { text: 'Log in' },
        },
      },
      rules,
    );
    super({ authForm });
  }

  protected render(): string {
    return `
    <div>
      {{{ authForm }}}
    </div>
    `;
  }
}
