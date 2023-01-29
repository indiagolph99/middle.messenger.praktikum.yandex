import { AuthForm } from '$components';
import { Block } from '$core';
import { FormItemProps } from '$components/formItem';
import {
  ALNU_HYPHEN_UNDERSCORE,
  ALPHA_REQUIRED,
  CAPITAL_REQUIRED,
  CAPITALIZED,
  DIGIT_REQUIRED,
  EMAIL,
  LATIN_AND_CYRILLIC,
  ONLY_DIGITS,
} from '$utils/regexps';

import { AuthController } from '$controllers';
import { SignUpRequest } from '$api/types';

export default class SignUpForm extends Block {
  private authController: AuthController;

  public static componentName = 'Sign up';

  constructor() {
    const itemsConfig = [
      { inputProps: { name: 'email', type: 'email', placeholder: 'Email' } },
      { inputProps: { name: 'login', placeholder: 'Login' } },
      { inputProps: { name: 'first_name', placeholder: 'First name' } },
      { inputProps: { name: 'second_name', placeholder: 'Last name' } },
      { inputProps: { name: 'phone', type: 'tel', placeholder: 'Phone' } },
      {
        inputProps: {
          name: 'password',
          type: 'password',
          placeholder: 'Password',
        },
      },
      {
        inputProps: {
          name: 'repeat_password',
          type: 'password',
          placeholder: 'Repeat password',
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
      repeat_password: [
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
      email: [
        {
          required: true,
          pattern: EMAIL.pattern,
          message: EMAIL.message,
        },
      ],
      first_name: [
        {
          required: true,
          pattern: LATIN_AND_CYRILLIC.pattern,
          message: LATIN_AND_CYRILLIC.message,
        },
        {
          pattern: CAPITALIZED.pattern,
          message: CAPITALIZED.message,
        },
      ],
      second_name: [
        {
          required: true,
          pattern: LATIN_AND_CYRILLIC.pattern,
          message: LATIN_AND_CYRILLIC.message,
        },
        {
          pattern: CAPITALIZED.pattern,
          message: CAPITALIZED.message,
        },
      ],
      phone: [
        {
          required: true,
          min: 10,
          max: 15,
          pattern: ONLY_DIGITS.pattern,
          message: ONLY_DIGITS.message,
        },
      ],
    };

    const authForm = new AuthForm(
      {
        title: 'Sign up',
        linkTitle: 'Log in ',
        linkHref: '/login',
        formConfig: {
          itemsConfig,
          formId: 'signup',
          buttonConfig: { text: 'Sign up' },
        },
      },
      rules,
    );
    super({ authForm, error: '' });
    this.authController = new AuthController();
    this.setProps({
      events: {
        submit: (event: SubmitEvent) => {
          this.setProps({ error: '' });
          const formData = new FormData(event.target as HTMLFormElement);
          const formDataObj = Object.fromEntries(formData.entries());
          this.authController
            .signup(formDataObj as unknown as SignUpRequest)
            .catch(() =>
              this.refs.authform.setProps({ error: 'Something went wrong' }),
            );
        },
      },
    });
  }

  protected render(): string {
    return `
    <main class="center flex flex-column flex-x-center flex-center height-max-vh">
      {{{ authForm }}}
    </main>
    `;
  }
}
